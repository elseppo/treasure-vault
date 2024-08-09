import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";

import { ThemeSwitch } from "@/components/theme-switch";
import { fetchAndSafeScryfallCards } from "@/lib/scryfall/scryfallService";

export const Navbar = () => {
  const handleFetchClick = async () => {
    await fetchAndSafeScryfallCards();
  };

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <Button onClick={handleFetchClick} />
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>
    </NextUINavbar>
  );
};
