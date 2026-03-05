import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const cookieCountAtom = atomWithStorage("cookieCount", 0);
export const cpsAtom = atomWithStorage("cps", 0);
export const lastUpdateAtom = atom(Date.now());
