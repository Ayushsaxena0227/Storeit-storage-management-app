"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  deleteFileUsers,
  renameFile,
  updatedFileUsers,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails } from "./ActionModalContent";
import { ShareInput } from "./ActionModalContent";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  //   console.log(file);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isDropDownopen, setisDropDownopen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsloading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const path = usePathname();

  // this is for when u just simply press cancel
  const closeAllModels = () => {
    setisModalOpen(false);
    setisDropDownopen(false);
    setAction(null);
    setName(file.name);
    // setemails([]);
  };

  const handleAction = async () => {
    if (!action) return;

    setIsloading(true);
    let success: boolean = false; // Ensure success is always boolean

    const actions: Record<string, () => Promise<boolean>> = {
      rename: async () => {
        const result = await renameFile({
          fileId: file.$id,
          name,
          extension: file.extension,
          path,
        });

        return result ?? false; // Ensure it always returns a boolean
      },
      share: async () => {
        await updatedFileUsers({ fileId: file.$id, emails, path });
        return true;
      },
      delete: async () => {
        await deleteFileUsers({
          fileId: file.$id,
          path,
          bucketFileId: file.bucketFileId,
        });
        return true;
      },
    };

    if (action.value in actions) {
      success = await actions[action.value]();
    }

    if (success) closeAllModels();

    setIsloading(false);
  };

  //   FUNCTION FOR SHARING MODAL
  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);
    await updatedFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });

    setEmails(updatedEmails);
    closeAllModels();
  };
  // COMMON MODAL FOR RENAME, SHARE, DELETE

  const renderDialogContent = () => {
    if (!action) return null;
    const { value, label } = action;
    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{" "}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {["rename", "share", "delete"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModels} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  width={24}
                  height={24}
                  className="animate-spin"
                  alt="loader"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setisModalOpen}>
      <DropdownMenu open={isDropDownopen} onOpenChange={setisDropDownopen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionitem) => (
            <DropdownMenuItem
              key={actionitem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionitem);

                if (
                  ["rename", "share", "delete", "details"].includes(
                    actionitem.value
                  )
                ) {
                  setisModalOpen(true);
                }
              }}
            >
              {actionitem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionitem.icon}
                    alt={actionitem.label}
                    width={30}
                    height={30}
                  />
                  {actionitem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionitem.icon}
                    alt={actionitem.label}
                    width={30}
                    height={30}
                  />
                  {actionitem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
