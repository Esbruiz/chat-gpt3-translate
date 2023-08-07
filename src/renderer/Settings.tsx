import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import openAi from 'openai';

export default function Settings({
  open,
  setOpen,
  settings,
  setSettings,
  apiKey: outerApiKey,
  setApiKey: setOuterApiKey,
}: any) {
  // create state variables for openAi createCompletion request
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [top_p, setTop_p] = useState(0);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [temperature, setTemperature] = useState(0);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [max_tokens, setMax_tokens] = useState(0);

  const saveSettings = () => {
    if (apiKey !== '') {
      window.localStorage.setItem('apiKey', apiKey);
      setOuterApiKey(apiKey);
    }
    delete settings.best_of;
    setSettings({
      ...settings,
      model: model || settings.model,
      max_tokens: max_tokens || settings.max_tokens,
      top_p: top_p || settings.top_p,
      temperature: temperature || settings.temperature,
    });
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Chat GPT Translate Settings
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="absolute inset-0 px-4 sm:px-6 space-y-6">
                        <div>
                          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                          <label
                            htmlFor="apiKey"
                            className="block text-sm font-medium text-gray-700"
                          >
                            apiKey
                          </label>
                          <div className="mt-1">
                            <input
                              onChange={(e) => setApiKey(e.target.value)}
                              type="text"
                              defaultValue={outerApiKey}
                              name="apiKey"
                              id="apiKey"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="some api key"
                            />
                          </div>
                          <p
                            className="mt-2 text-sm text-gray-500"
                            id="email-description"
                          >
                            This is only stored locally in order to make
                            apiRequests.
                          </p>
                        </div>

                        <div>
                          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                          <label
                            htmlFor="model"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Model
                          </label>
                          <div className="mt-1">
                            <input
                              onChange={(e) => setModel(e.target.value)}
                              type="text"
                              name="model"
                              id="model"
                              defaultValue={settings.model}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="EX: gpt-3.5-turbo"
                            />
                          </div>
                          <p
                            className="mt-2 text-sm text-gray-500"
                            id="email-description"
                          >
                            Sets to model against which the request is
                            made.&nbsp;
                            <a
                              href="https://platform.openai.com/docs/models/gpt-3-5"
                              className="text-indigo-600 hover:text-indigo-500"
                            >
                              More information
                            </a>
                          </p>
                        </div>

                        <div>
                          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                          <label
                            htmlFor="top_p"
                            className="block text-sm font-medium text-gray-700"
                          >
                            top_p
                          </label>
                          <div className="mt-1">
                            <input
                              onChange={(e) =>
                                setTop_p(parseInt(e.target.value, 10))
                              }
                              type="text"
                              name="top_p"
                              defaultValue={settings.top_p}
                              id="top_p"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="0.5"
                            />
                          </div>
                          <p
                            className="mt-2 text-sm text-gray-500"
                            id="top_p-description"
                          >
                            The model considers the results of the tokens with
                            top_p probability mass. So 0.1 means only the tokens
                            comprising the top 10% probability mass are
                            considered
                          </p>
                        </div>

                        <div>
                          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                          <label
                            htmlFor="temperature"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Temperature
                          </label>
                          <div className="mt-1">
                            <input
                              onChange={(e) =>
                                setTemperature(parseFloat(e.target.value))
                              }
                              type="text"
                              defaultValue={settings.temperature}
                              name="temperature"
                              id="temperature"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="2"
                            />
                          </div>
                          <p
                            className="mt-2 text-sm text-gray-500"
                            id="best_of-description"
                          >
                            What sampling temperature to use, between 0 and 2.
                            Higher values like 0.8 will make the output more
                            random, while lower values like 0.2 will make it
                            more focused and deterministic.
                          </p>
                        </div>

                        <div>
                          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                          <label
                            htmlFor="max_tokens"
                            className="block text-sm font-medium text-gray-700"
                          >
                            top_p
                          </label>
                          <div className="mt-1">
                            <input
                              onChange={(e) =>
                                setMax_tokens(parseInt(e.target.value, 10))
                              }
                              type="text"
                              defaultValue={settings.max_tokens}
                              name="max_tokens"
                              id="max_tokens"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="0.5"
                            />
                          </div>
                          <p
                            className="mt-2 text-sm text-gray-500"
                            id="max_tokens-description"
                          >
                            Number of chars to be returned
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={() => saveSettings()}
                            type="button"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
