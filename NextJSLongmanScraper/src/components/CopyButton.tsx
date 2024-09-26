"use client";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { LuCopy } from "react-icons/lu";
import { LuCopyCheck } from "react-icons/lu";

type CopyButtonProps = {
  code: string;
};

function CopyButton({ code }: CopyButtonProps) {
  const [showCopyCheckIcon, setShowCopyCheckIcon] = useState(false);
  useEffect(
    function () {
      if (!showCopyCheckIcon) return;
      // Use setTimeout to update the icon after 2000 milliseconds (2 seconds)
      const timeoutId = setTimeout(() => {
        setShowCopyCheckIcon(false);
      }, 2000);

      // Cleanup function to clear the timeout if the component unmounts
      return () => clearTimeout(timeoutId);
    },
    [showCopyCheckIcon]
  );

  return (
    <button className="absolute top-12 right-16 flex flex-col justify-center items-center">
      <CopyToClipboard text={code} onCopy={() => setShowCopyCheckIcon(true)}>
        <div>
          {!showCopyCheckIcon ? (
            <LuCopy
              style={{ color: "white", width: "1.5rem", height: "1.5rem" }}
            />
          ) : (
            <LuCopyCheck
              style={{ color: "white", width: "1.5rem", height: "1.5rem" }}
            />
          )}
        </div>
      </CopyToClipboard>
      <p className="text-white w-16">{showCopyCheckIcon ? "Copied!" : ""}</p>
    </button>
  );
}

export default CopyButton;
