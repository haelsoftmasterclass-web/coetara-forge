import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileNav from "@/components/MobileNav";
import { DesktopNav } from "@/components/NavLinks";
import { mobileNav, nav } from "@/lib/site";

const pathname = vi.hoisted(() => ({ value: "/instructors" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.value }));

const ctas = [
  { label: "Apply for a Scholarship", href: "/#scholarships", live: false },
  { label: "Explore Courses", href: "/#learning-areas", live: false },
];

describe("DesktopNav", () => {
  it("marks the current page and opens the About menu with the keyboard", async () => {
    pathname.value = "/instructors";
    const user = userEvent.setup();
    render(<DesktopNav groups={nav} />);
    expect(screen.getByRole("link", { name: "Instructors" })).toHaveAttribute("aria-current", "page");

    const about = screen.getByRole("button", { name: "About" });
    expect(about).toHaveAttribute("aria-expanded", "false");
    about.focus();
    await user.keyboard("{Enter}");
    expect(about).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /our story/i })).toBeVisible();
    await user.keyboard("{Escape}");
    expect(about).toHaveAttribute("aria-expanded", "false");
  });
});

describe("MobileNav", () => {
  it("opens as a dialog, highlights the current page, and closes with Escape", async () => {
    pathname.value = "/team";
    const user = userEvent.setup();
    render(<MobileNav items={mobileNav} ctas={ctas} logo={<span>Logo</span>} />);

    const opener = screen.getByRole("button", { name: /open menu/i });
    await user.click(opener);
    const dialog = screen.getByRole("dialog", { name: "Menu" });
    expect(within(dialog).getByRole("link", { name: /our team/i })).toHaveAttribute("aria-current", "page");
    expect(within(dialog).getAllByText(/coming soon/i)).toHaveLength(2);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
