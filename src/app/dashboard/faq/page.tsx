import { FC } from "react";

interface pageProps {}
const page: FC<pageProps> = ({}) => {
  return (
    <div className="bg-white my-2 rounded-lg">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-slate-900 dark:text-white">
          Frequently asked questions
        </h2>
        <div className="grid pt-8 text-left border-t border-slate-200 md:gap-16  md:grid-cols-2">
          <div className="mb-10">
            <h3 className="flex items-center mb-4 text-lg font-medium text-slate-900 dark:text-white">
              <svg
                className="flex-shrink-0 mr-2 w-5 h-5 text-slate-50"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              What does lifetime access exactly mean?
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Once you have purchased either the design, code, or both packages,
              you will have access to all of the future updates based on the
              roadmap, free of charge.
            </p>
          </div>
          <div className="mb-10">
            <h3 className="flex items-center mb-4 text-lg font-medium text-slate-900 dark:text-white">
              <svg
                className="flex-shrink-0 mr-2 w-5 h-5 text-slate-500 dark:text-slate-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              How does support work?
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Were aware of the importance of well qualified support, that is
              why we decided that support will only be provided by the authors
              that actually worked on this project.
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Feel free to{" "}
              <a
                href="#"
                className="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline"
                target="_blank"
                rel="noreferrer"
              >
                contact us
              </a>{" "}
              and well help you out as soon as we can.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="flex items-center mb-4 text-lg font-medium text-slate-900 dark:text-white">
              <svg
                className="flex-shrink-0 mr-2 w-5 h-5 text-slate-500 dark:text-slate-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              What does free updates include?
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              The free updates that will be provided is based on the{" "}
              <a
                href="#"
                className="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline"
              >
                roadmap
              </a>{" "}
              that we have laid out for this project. It is also possible that
              we will provide extra updates outside of the roadmap as well.
            </p>
          </div>
          <div className="mb-10">
            <h3 className="flex items-center mb-4 text-lg font-medium text-slate-900 dark:text-white">
              <svg
                className="flex-shrink-0 mr-2 w-5 h-5 text-slate-500 dark:text-slate-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              What does the free version include?
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              The{" "}
              <a
                href="#"
                className="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline"
              >
                free version
              </a>{" "}
              of Windster includes a minimal style guidelines, component
              variants, and a dashboard page with the mobile version alongside
              it.
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              You can use this version for any purposes, because it is
              open-source under the MIT license.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
