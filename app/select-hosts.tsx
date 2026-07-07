"use client";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function SelectHosts<T extends { id: string; name: string }>(props: {
  guests: T[];
  hosts: T[];
  setHosts: (hosts: T[]) => void;
  id?: string;
  selectMany: boolean;
}) {
  const { guests, hosts, setHosts, id, selectMany } = props;
  const [query, setQuery] = useState("");
  const filteredGuests = guests
    .filter((guest) => guest.name.toLowerCase().includes(query.toLowerCase()))
    .filter((guest) => guest.name.trim().length > 0)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 20);

  const comboboxContent = (
    <div className="relative mt-1">
      <div className="relative w-full min-h-12 h-fit rounded-md border transition-colors border-gray-300 bg-white py-2 pl-3 pr-10 focus-within:ring-2 focus-within:ring-rose-400 focus-within:border-transparent">
        <div className="flex flex-wrap gap-1 items-center">
          {hosts.length > 0 && (
            <>
              {hosts.map((host) => (
                <span
                  key={host.id}
                  className="py-1 px-2 bg-gray-100 rounded text-nowrap text-sm flex items-center gap-1"
                >
                  {host.name}
                  <span
                    onClick={(e) => {
                      setHosts(hosts.filter((h) => h.id !== host.id));
                      e.stopPropagation();
                    }}
                    role="button"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-700" />
                  </span>
                </span>
              ))}
            </>
          )}
          <Combobox.Input
            id={id}
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            className="border-none focus:ring-0 px-0 py-1 text-sm flex-1 min-w-8 bg-transparent placeholder:text-gray-400 outline-none"
          />
        </div>
      </div>
      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
      </Combobox.Button>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery("")}
      >
        <Combobox.Options className="absolute mt-1 max-h-60 z-10 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {filteredGuests.length === 0 && query !== "" ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
              Nothing found.
            </div>
          ) : (
            filteredGuests.map((guest) => (
              <Combobox.Option
                key={guest.id}
                className={({ active }) =>
                  clsx(
                    "relative cursor-pointer select-none py-2 pl-10 pr-4 z-10",
                    active
                      ? "bg-rose-100 text-rose-900"
                      : "text-gray-900 bg-white"
                  )
                }
                value={guest}
              >
                {({ selected, disabled }) => (
                  <>
                    <span
                      className={clsx(
                        "block truncate",
                        selected ? "font-medium" : "font-normal",
                        disabled ? "text-gray-400" : "text-gray-900"
                      )}
                    >
                      {guest.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-rose-400">
                        <CheckIcon className="h-5 w-5" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Transition>
    </div>
  );
  return (
    <div className="w-full">
      {selectMany ? (
        <Combobox
          value={hosts}
          by="id"
          onChange={(newHosts) => {
            setHosts(newHosts);
            setQuery("");
          }}
          multiple
          immediate
        >
          {comboboxContent}
        </Combobox>
      ) : (
        <Combobox
          value={hosts[0] ?? null}
          by="id"
          onChange={(newHosts) => {
            setHosts(newHosts ? [newHosts] : []);
            setQuery("");
          }}
          immediate
        >
          {comboboxContent}
        </Combobox>
      )}
    </div>
  );
}
