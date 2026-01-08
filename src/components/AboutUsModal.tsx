import { useEffect, useState } from "react";
import { X } from "lucide-react";

type AboutUsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Optional: pass a photo later (e.g. "/assets/anna.jpg") */
  photoSrc?: string;
};

export default function AboutUsModal({
  isOpen,
  onClose,
  photoSrc,
}: AboutUsModalProps) {
  const [noGlasses, setNoGlasses] = useState(false);

  // ✅ Default to your public image if no prop is provided
const resolvedPhotoSrc =
  photoSrc ?? `${import.meta.env.BASE_URL}Anne-Miller-headshot.png`;


  // Reset mode when closing
  useEffect(() => {
    if (!isOpen) setNoGlasses(false);
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Sizes/spacing for No Glasses mode (everything larger: title, buttons, photo, text)
  const titleClass = noGlasses
    ? "text-3xl sm:text-4xl"
    : "text-2xl sm:text-3xl";
  const subTitleClass = noGlasses
    ? "text-base sm:text-lg"
    : "text-sm sm:text-base";
  const bodyTextClass = noGlasses
    ? "text-lg sm:text-xl leading-8 sm:leading-9"
    : "text-sm sm:text-base leading-relaxed";

  const paddingClass = noGlasses
    ? "px-6 sm:px-10 py-7 sm:py-10"
    : "px-6 sm:px-8 py-6 sm:py-8";

  const photoBoxClass = noGlasses
    ? "w-28 h-28 sm:w-32 sm:h-32"
    : "w-16 h-16 sm:w-20 sm:h-20";

  const nameClass = noGlasses ? "text-xl sm:text-2xl" : "text-base sm:text-lg";
  const roleClass = noGlasses ? "text-base sm:text-lg" : "text-sm";

  const buttonClass = noGlasses
    ? "px-5 py-3 text-base sm:text-lg"
    : "px-4 py-2 text-sm";

  const closeBtnSize = noGlasses ? "h-12 w-12" : "h-10 w-10";
  const closeIconSize = noGlasses ? "h-6 w-6" : "h-5 w-5";

  return (
    <>
      {/* Thick scrollbar styling scoped to this component */}
      <style>{`
        .wagly-scroll {
          scrollbar-width: auto; /* Firefox */
          scrollbar-color: rgba(138,154,91,0.75) rgba(0,0,0,0.08);
        }
        .wagly-scroll::-webkit-scrollbar { width: 14px; }
        .wagly-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.08); border-radius: 999px; }
        .wagly-scroll::-webkit-scrollbar-thumb { background: rgba(138,154,91,0.75); border-radius: 999px; }
        .wagly-scroll::-webkit-scrollbar-thumb:hover { background: rgba(138,154,91,0.9); }
      `}</style>

      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
        role="dialog"
        aria-modal="true"
        aria-label="About Us"
        onMouseDown={(e) => {
          // Close when clicking overlay only
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="relative w-full max-w-2xl rounded-2xl bg-[#F9F6F0] shadow-2xl border border-black/5 overflow-hidden">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className={`absolute right-4 top-4 inline-flex ${closeBtnSize} items-center justify-center rounded-full bg-white/80 text-gray-700 hover:bg-white transition shadow-sm border border-black/5`}
            aria-label="Close"
          >
            <X className={closeIconSize} />
          </button>

          {/* Scroll container (always scrollable, thick scrollbar) */}
          <div
            className={`wagly-scroll max-h-[90vh] overflow-y-auto ${paddingClass}`}
          >
            {/* Header */}
            <div className="pr-14">
              <h2 className={`${titleClass} font-extrabold text-gray-900`}>
                About Us
              </h2>
              <p className={`mt-2 ${subTitleClass} text-gray-600`}>
                A little story from our family to yours.
              </p>
            </div>

            {/* Top row: photo + identity + No Glasses toggle */}
            <div
              className={`mt-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6`}
            >
              {/* Photo + name */}
              <div className="flex items-center gap-4">
                <div
                  className={`${photoBoxClass} rounded-2xl bg-white shadow-sm border border-black/10 overflow-hidden flex items-center justify-center`}
                >
                  <img
                    src={resolvedPhotoSrc}
                    alt="Anna Miller"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div>
                  <div className={`${nameClass} font-extrabold text-gray-900`}>
                    Anna Miller
                  </div>
                  <div className={`${roleClass} text-gray-600`}>
                    Founder • Mom of two
                  </div>
                </div>
              </div>

              {/* No Glasses toggle */}
              <div className="sm:ml-auto">
                <button
                  type="button"
                  onClick={() => setNoGlasses((v) => !v)}
                  className={`rounded-2xl ${buttonClass} font-extrabold shadow-sm transition border w-full sm:w-auto ${
                    noGlasses
                      ? "bg-[#8A9A5B] text-white border-[#8A9A5B]"
                      : "bg-white text-gray-900 border-black/10 hover:border-[#8A9A5B]"
                  }`}
                >
                  {noGlasses ? "No Glasses: ON" : "No Glasses Mode"}
                </button>

                <div
                  className={`mt-2 ${
                    noGlasses ? "text-sm" : "text-xs"
                  } text-gray-500`}
                >
                  Larger text, bigger layout, easier reading
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-6 h-px bg-black/10" />

            {/* Body */}
            <div className={`mt-6 ${bodyTextClass} text-gray-800 space-y-5`}>
              <p>
                Hi, my name is{" "}
                <span className="font-extrabold text-gray-900">
                  Anna Miller
                </span>
                , and I’m a mom of two.
              </p>

              <p>
                I was born and raised in the United States, and like many
                parents, I always wanted my children to grow up with a pet.
                Dogs, especially, teach kids kindness, responsibility, patience,
                and unconditional love. The problem was… I’m extremely allergic
                to dogs.
              </p>

              <p>
                For a long time, I felt like my kids were missing out on
                something really special.
              </p>

              <p>
                When I found a way for them to enjoy the comfort and
                companionship of a puppy without triggering my allergies, I saw
                a real change. They became more gentle, more caring, and more
                emotionally connected. It wasn’t just a toy, it became something
                they loved and looked after.
              </p>

              <p>
                What frustrated me most was seeing how many cheap, poorly made,
                and misleading products were being sold to parents and
                grandparents who just wanted something meaningful for their
                children. Families deserve better than that.
              </p>

              <p>So I decided to take it into my own hands.</p>

              <p>
                I created this for parents, grandparents, and caregivers who
                want to give children the experience of nurturing and bonding,
                without the mess, allergies, or heartbreak. My goal is simple:
                make something safe, comforting, and genuinely joyful that
                families can trust.
              </p>

              <p>
                From my family to yours, I truly hope this brings as much
                happiness to your home as it has to mine.
              </p>

              <p className="font-extrabold text-gray-900">— Anna Miller</p>

              {/* Extra bottom padding so last line isn’t jammed against the edge on mobile */}
              <div className="h-2" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
