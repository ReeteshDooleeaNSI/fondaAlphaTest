import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
let openai: OpenAI | null = null;

// We'll store the thread ID
let THREAD_ID: string | null = null;

// Map of assistant IDs for different pages
const ASSISTANT_IDS: Record<string, string> = {
  '1': 'asst_ARzWGV9SQBqzlUjd9lRKeFNb', // Replace with your actual assistant IDs
  '2': 'asst_ARzWGV9SQBqzlUjd9lRKeFNb',
  // Add more assistants as needed
};

// Helper function to clean answer text
function cleanAnswerText(answer: string): string {
  // Remove the audio recording URL if present
  return answer.replace(/\s*\[Enregistrement Audio: blob:[^\]]+\]\s*/, '');
}

function initializeOpenAI() {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not found in environment variables (VITE_OPENAI_API_KEY)');
    return null;
  }
  
  try {
    if (!openai) {
      openai = new OpenAI({ 
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // Enable browser usage
      });
      console.log('OpenAI client initialized successfully');
    }
    return openai;
  } catch (error) {
    console.error('Error initializing OpenAI client:', error);
    return null;
  }
}

export async function initializeAssistant(pageNumber: string = '1') {
  console.log('Getting assistant for page:', pageNumber);
  const api = initializeOpenAI();
  if (!api) {
    console.warn('Could not initialize OpenAI client');
    return null;
  }

  try {
    const assistantId = ASSISTANT_IDS[pageNumber] || ASSISTANT_IDS['1']; // Default to first assistant if page not found
    
    if (!assistantId) {
      console.error('No assistant ID configured for page:', pageNumber);
      return null;
    }

    // Verify the assistant exists
    try {
      const assistant = await api.beta.assistants.retrieve(assistantId);
      console.log('Using existing assistant:', assistant.id);
      return assistant.id;
    } catch (error) {
      console.error('Error retrieving assistant:', error);
      return null;
    }
  } catch (error) {
    console.error('Error initializing assistant:', error);
    return null;
  }
}

export async function createThread(initialQuestion: string, initialAnswer: string) {
  console.log('Starting thread creation with initial Q&A');
  const api = initializeOpenAI();
  if (!api) {
    console.warn('Could not initialize OpenAI client for thread creation');
    return null;
  }

  try {
    console.log('Creating new thread...');
    // Create thread with initial question as assistant message
    const thread = await api.beta.threads.create();
    THREAD_ID = thread.id;

    // Add the initial question as an assistant message
    await api.beta.threads.messages.create(thread.id, {
      role: "assistant",
      content: initialQuestion
    });

    // Add the user's answer (cleaned)
    await api.beta.threads.messages.create(thread.id, {
      role: "user",
      content: cleanAnswerText(initialAnswer)
    });

    console.log('Thread created successfully with ID:', THREAD_ID);
    return thread.id;
  } catch (error) {
    console.error('Error creating thread:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return null;
  }
}

export async function addMessageToThread(answer: string) {
  const api = initializeOpenAI();
  if (!api || !THREAD_ID) return null;

  try {
    await api.beta.threads.messages.create(THREAD_ID, {
      role: "user",
      content: cleanAnswerText(answer)
    });
    return true;
  } catch (error) {
    console.error('Error adding message to thread:', error);
    return null;
  }
}

export async function getAssistantResponse(assistantId: string): Promise<string | null> {
  const api = initializeOpenAI();
  if (!api || !THREAD_ID) return null;

  try {
    // Create a run
    console.log('Creating run with assistant:', assistantId);
    const run = await api.beta.threads.runs.create(THREAD_ID, {
      assistant_id: assistantId,
      });

    // Wait for the run to complete
    let runStatus = await api.beta.threads.runs.retrieve(THREAD_ID, run.id);
    
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      console.log('Waiting for assistant response...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      runStatus = await api.beta.threads.runs.retrieve(THREAD_ID, run.id);
    }

    if (runStatus.status === 'completed') {
      // Get the latest message
      const messages = await api.beta.threads.messages.list(THREAD_ID);
      const latestMessage = messages.data[0]; // Get the most recent message

      if (latestMessage && latestMessage.role === 'assistant') {
        const content = latestMessage.content[0];
        if ('text' in content) {
          return content.text.value;
        }
      }
    } else {
      console.error('Run failed or cancelled:', runStatus.status);
    }

    return null;
  } catch (error) {
    console.error('Error getting assistant response:', error);
    return null;
  }
}

export async function getThread() {
  return THREAD_ID;
} 