import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "en", "fr", "ar"],
  defaultLocale: "nl",
});
