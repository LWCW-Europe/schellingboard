"use client";
import { useContext, useState } from "react";
import Image from "next/image";
import { MapIcon } from "@heroicons/react/24/outline";
import { Modal } from "@/app/components/modal";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/app/components/buttons";
import { UserSelect } from "./user-select";
import { UserContext } from "./context";
import type { Guest } from "@/db/repositories/interfaces";

export function MapModal({ mapImageUrl }: { mapImageUrl: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-label="Show map"
        className="relative inline-flex items-center justify-center rounded-md p-1.5 bg-brand text-on-brand hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-accent"
        onClick={() => setOpen(true)}
      >
        <MapIcon className="h-5 w-5 stroke-2" aria-hidden="true" />
      </button>
      <Modal open={open} setOpen={setOpen}>
        {/* The map is an arbitrary, admin-uploaded image of unknown dimensions;
            serve it directly (unoptimized) rather than through the responsive
            optimizer, which would emit a srcset we don't need. */}
        <Image
          src={mapImageUrl}
          alt="Map"
          className="w-full h-auto"
          width={0}
          height={0}
          sizes="100vw"
          unoptimized
        />
      </Modal>
    </div>
  );
}

export function CurrentUserModal(props: {
  guests: Guest[];
  hosts: string[];
  open: boolean;
  close: () => void;
  rsvp: () => void;
  sessionInfoDisplay?: React.ReactNode;
  rsvpd: boolean;
  zIndex?: string;
  portal?: boolean; // For nested modal contexts
}) {
  const { user: currentUser } = useContext(UserContext);
  const {
    guests,
    hosts,
    open,
    close,
    rsvp,
    sessionInfoDisplay,
    rsvpd,
    zIndex,
    portal,
  } = props;
  const isDisabled = hosts.includes(currentUser || "");
  const { user } = useContext(UserContext);
  const onClickHandler = () => {
    rsvp();
    close();
  };
  return (
    <Modal open={open} setOpen={close} zIndex={zIndex} portal={portal}>
      <div className="pr-8">{sessionInfoDisplay}</div>
      {
        <div className="mt-2">
          <span className="text-fg-subtle">RSVPing as...</span>
          <UserSelect guests={guests} />
        </div>
      }
      {user && (
        <div className="relative mt-4 inline-block group">
          <button
            type="button"
            className={PRIMARY_BUTTON}
            onClick={onClickHandler}
            disabled={isDisabled}
          >
            {rsvpd ? "Un-RSVP" : "RSVP"}
          </button>
          {isDisabled && (
            <div className="absolute bottom-3/4 left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm text-fg-inverse bg-surface-inverse rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Cannot RSVP to your own event
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

export function ConfirmDeletionModal(props: {
  btnDisabled: boolean;
  // Void as well as async: a confirm that hands the work to a transition
  // returns before the work is done.
  confirm: () => void | Promise<void>;
  itemName: string;
}) {
  const { btnDisabled, confirm, itemName } = props;
  const [open, setOpen] = useState(false);

  const clickHandler = async () => {
    await confirm();
    setOpen(false);
  };
  return (
    <>
      <button
        type="submit"
        className="bg-surface-raised text-danger-fg font-semibold py-2 rounded shadow disabled:bg-surface-hover border-2 border-danger mx-auto px-12 hover:bg-danger-tint active:bg-danger-tint"
        onClick={() => setOpen(true)}
        disabled={btnDisabled}
      >
        Delete
      </button>
      <Modal open={open} setOpen={setOpen}>
        <p className="pr-8">Delete {itemName}?</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className={PRIMARY_BUTTON}
            onClick={() => void clickHandler()}
          >
            Yes
          </button>
          <button
            type="button"
            className={SECONDARY_BUTTON}
            onClick={() => setOpen(false)}
          >
            No
          </button>
        </div>
      </Modal>
    </>
  );
}

export function ConfirmationModal(props: {
  open: boolean;
  close: () => void;
  confirm: () => void;
  message: string;
  zIndex?: string;
  portal?: boolean; // For nested modal contexts
}) {
  const { open, close, confirm, message, zIndex, portal } = props;
  const clickHandler = () => {
    confirm();
    close();
  };
  return (
    <>
      <Modal open={open} setOpen={close} zIndex={zIndex} portal={portal}>
        <p className="pr-8">{message}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className={PRIMARY_BUTTON}
            onClick={clickHandler}
          >
            Yes
          </button>
          <button type="button" className={SECONDARY_BUTTON} onClick={close}>
            No
          </button>
        </div>
      </Modal>
    </>
  );
}

export function AlertModal(props: {
  open: boolean;
  close: () => void;
  message: string;
  zIndex?: string;
  portal?: boolean; // For nested modal contexts
}) {
  const { open, close, message, zIndex, portal } = props;
  return (
    <Modal open={open} setOpen={close} zIndex={zIndex} portal={portal}>
      <p role="alert" className="pr-8">
        {message}
      </p>
      <div className="mt-4">
        <button type="button" className={PRIMARY_BUTTON} onClick={close}>
          OK
        </button>
      </div>
    </Modal>
  );
}
