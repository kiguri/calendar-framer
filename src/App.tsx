import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";

import violet from "./assets/violet_evergarden.jpeg";

export default function App() {
  let [monthString, setMonthString] = useState(format(new Date(), "yyyy-MM"));
  let [direction, setDirection] = useState(0);
  let [isAnimating, setIsAnimating] = useState(false);
  let month = parse(monthString, "yyyy-MM", new Date());

  // current date fns
  const currentDate = format(new Date(), "yyyy-MM-dd");

  function nextMonth() {
    if (isAnimating) return;

    let next = addMonths(month, 1);

    setMonthString(format(next, "yyyy-MM"));
    setDirection(1);
    setIsAnimating(true);
  }

  function previousMonth() {
    if (isAnimating) return;

    let previous = subMonths(month, 1);

    setMonthString(format(previous, "yyyy-MM"));
    setDirection(-1);
    setIsAnimating(true);
  }

  let days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  return (
    <MotionConfig transition={transition}>
      <div
        // background image no repeat
        style={{
          backgroundImage: `url(${violet})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className="flex min-h-screen items-start pt-16 text-stone-900"
      >
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white">
          <div className="py-8">
            <div className="flex flex-col justify-center rounded text-center">
              <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={direction}
                onExitComplete={() => setIsAnimating(false)}
              >
                <motion.div
                  key={monthString}
                  initial="enter"
                  animate="middle"
                  exit="exit"
                >
                  <header className="relative flex justify-between px-8">
                    <motion.button
                      className="z-10 rounded-full p-1.5 hover:bg-stone-100"
                      onClick={previousMonth}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </motion.button>
                    <motion.p
                      variants={variants}
                      custom={direction}
                      className="absolute inset-0 flex items-center justify-center font-semibold"
                    >
                      {format(month, "MMMM yyyy")}
                    </motion.p>
                    <motion.button
                      className="z-10 rounded-full p-1.5 hover:bg-stone-100"
                      onClick={nextMonth}
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </motion.button>
                  </header>

                  <motion.div className="mt-6 grid grid-cols-7 gap-y-6 px-8 text-sm">
                    <span className="font-medium text-stone-500">Su</span>
                    <span className="font-medium text-stone-500">Mo</span>
                    <span className="font-medium text-stone-500">Tu</span>
                    <span className="font-medium text-stone-500">We</span>
                    <span className="font-medium text-stone-500">Th</span>
                    <span className="font-medium text-stone-500">Fr</span>
                    <span className="font-medium text-stone-500">Sa</span>
                  </motion.div>

                  <motion.div
                    variants={variants}
                    custom={direction}
                    className="mt-6 grid grid-cols-7 gap-y-6 px-8 text-sm"
                  >
                    {days.map((day) => {
                      const today = format(day, "yyyy-MM-dd") === currentDate;

                      return (
                        <div
                          key={format(day, "yyyy-MM-dd")}
                          className={`${
                            isSameMonth(day, month) ? "" : "text-stone-300"
                          } font-semibold`}
                        >
                          <span
                            className={`${
                              today ? "bg-pink-500 text-white rounded-full" : ""
                            } px-[0.35rem] py-[0.30rem]`}
                          >
                            {format(day, "d")}
                          </span>
                        </div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

let transition = { type: "spring", bounce: 0, duration: 0.3 };
let variants = {
  enter: (direction: number) => {
    return { x: `${100 * direction}%`, opacity: 0 };
  },
  middle: { x: "0%", opacity: 1 },
  exit: (direction: number) => {
    return { x: `${-100 * direction}%`, opacity: 0 };
  },
};
