import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { debounce } from 'lodash';
import { WrenchIcon } from '@heroicons/react/24/outline';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Settings from './Settings';

const Hello = () => {
  const [greeting, setGreeting] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [text, setText] = useState('');
  const [openSettings, setOpenSettings] = useState(false);
  const [settings, setSettings] = useState({
    model: 'gpt-3.5-turbo',
    max_tokens: 100,
    top_p: 0.8,
    n: 1,
    stream: false,
    temperature: 0,
  });

  const configuration = new Configuration({});

  const openai = new OpenAIApi(configuration);

  const saveNewSettings = (newSettings: typeof settings) => {
    window.localStorage.setItem('settings', JSON.stringify(newSettings));
    setSettings({ ...newSettings });
  };

  const askGPTForTranslation = (
    innerText: string,
    innerSettings: typeof settings,
    innerApiKey: string
  ) => {
    try {
      openai
        .createChatCompletion(
          {
            ...innerSettings,
            messages: [
              {
                role: 'system',
                content: 'You are a machine translation system.',
              },
              {
                role: 'user',
                content: `Translate the following Japanese text to English: ${innerText}`,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${innerApiKey}`,
            },
          }
        )
        .then((response) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setText(response.data.choices[0].message.content as string);
          return true;
        })
        .catch((error) => setText(error));
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedAskGPTForTranslation = useRef(
    debounce(askGPTForTranslation, 1000)
  ).current;

  const translate = (
    textToTranslate: string,
    innerSettings: typeof settings,
    innerApiKey: string
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setGreeting(textToTranslate);
    debouncedAskGPTForTranslation(textToTranslate, innerSettings, innerApiKey);
  };

  const debouncedTranslate = useRef(
    debounce(
      async (
        criteria: string,
        innerSettings: typeof settings,
        innerApiKey: string
      ) => {
        await translate(criteria, innerSettings, innerApiKey);
      },
      1000
    )
  ).current;

  // create an useEffect hook to call the translate function only when the greeting changes
  useEffect(() => {
    if (greeting) {
      debouncedTranslate(greeting, settings, apiKey);
    }
  }, [greeting, debouncedTranslate, settings, apiKey]);

  window.electron.ipcRenderer.on('clipboard-change', (arg) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setGreeting(arg);
  });

  useEffect(() => {
    if (window.localStorage.getItem('apiKey')) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setApiKey(window.localStorage.getItem('apiKey'));
    }
    if (window.localStorage.getItem('settings')) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setSettings(JSON.parse(window.localStorage.getItem('settings')));
    }
  }, []);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-gray-200 h-screen">
        <div className="mx-auto max-w-3xl flex flex-col justify-center">
          <h1 className="text-3xl font-bold underline text-center mt-8">
            ChatGPT Translate
          </h1>
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700"
            >
              Translate
            </label>
            <div className="mt-1">
              <textarea
                rows={4}
                name="comment"
                id="comment"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                defaultValue={greeting as unknown as string}
                onChange={(e) => debouncedTranslate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold underline text-center">
              Response
            </h2>
            {text && text !== '' ? (
              <div className="mt-1">
                <textarea
                  disabled
                  rows={4}
                  name="comment"
                  id="comment"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={text}
                />
              </div>
            ) : (
              <div className="mt-1">
                <textarea
                  disabled
                  rows={4}
                  name="comment"
                  id="comment"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue="Waiting for response..."
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        className="absolute bottom-0 right-0 m-4 p-2 rounded-full bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
        type="button"
        onClick={() => setOpenSettings(true)}
      >
        <WrenchIcon className="h-6 w-6" />
      </button>
      <Settings
        settings={settings}
        apiKey={apiKey}
        setApiKey={setApiKey}
        setSettings={saveNewSettings}
        open={openSettings}
        setOpen={setOpenSettings}
      />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
