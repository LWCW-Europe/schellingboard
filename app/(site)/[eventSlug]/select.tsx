import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export type Option = {
  value: string;
  available: boolean;
  helperText?: string;
  display?: string;
};
export function MyListbox(props: {
  options: Option[];
  currValue?: string;
  setCurrValue: (value: string) => void;
  placeholder: string;
  truncateText: boolean;
}) {
  const { options, currValue, setCurrValue, placeholder, truncateText } = props;
  const currOption = options.find((option) => option.value === currValue);
  return (
    // `?? ""` keeps the Listbox controlled when no option is selected (e.g.
    // the chosen start time becomes unavailable after a day/location change);
    // an undefined value would flip it to uncontrolled and warn.
    <Listbox value={currValue ?? ""} onChange={setCurrValue}>
      <div className="relative mt-1">
        <Listbox.Button className="h-12 rounded-md border px-4 shadow-sm transition-colors invalid:border-danger invalid:text-danger-fg focus:outline-none relative w-full cursor-pointer border-line focus:ring-2 focus:ring-brand-accent focus:outline-0 focus:border-none bg-surface-raised py-2 pl-3 pr-10 text-left">
          {currValue ? (
            <span className="text-fg truncate flex items-center justify-between">
              {currOption?.display ?? currValue}
              {currOption?.helperText && (
                <span className="inline text-xs text-fg-subtle truncate">
                  {currOption.helperText}
                </span>
              )}
            </span>
          ) : (
            <span className="block truncate text-fg-subtle">{placeholder}</span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-fg-subtle" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-72 overflow-auto rounded-md bg-surface-raised py-1 text-base shadow-lg ring-1 ring-line-subtle focus:outline-none sm:text-sm">
            {options.map((option) => {
              return (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    clsx(
                      "relative cursor-pointer select-none py-2 pl-10 pr-4 z-10 disabled:text-fg-subtle disabled:cursor-default",
                      active
                        ? "bg-brand-tint-hover text-brand-fg"
                        : "text-fg bg-surface-raised"
                    )
                  }
                  disabled={!option.available}
                >
                  {({ selected, disabled }) => (
                    <>
                      <span
                        className={clsx(
                          "flex items-end justify-between",
                          truncateText ? "truncate" : "",
                          selected ? "font-medium" : "font-normal",
                          disabled ? "text-fg-subtle" : "text-fg"
                        )}
                      >
                        {option.display ?? option.value}
                        {option.helperText && (
                          <span className="inline text-xs text-fg-subtle truncate">
                            {option.helperText}
                          </span>
                        )}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-fg">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
