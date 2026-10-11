import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/ContactForm";

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), "Ada Obi");
  await user.type(screen.getByLabelText(/email address/i), "ada@example.com");
  await user.selectOptions(screen.getByLabelText(/^country/i), "Kenya");
  await user.type(screen.getByLabelText(/^subject/i), "Course updates");
  await user.type(screen.getByLabelText(/^message/i), "Please tell me when the data courses open.");
  await user.click(screen.getByRole("checkbox"));
}

afterEach(() => vi.unstubAllGlobals());

describe("ContactForm", () => {
  it("pre-selects the enquiry type and subject from the link", () => {
    render(<ContactForm initialType="partnership" initialSubject="Partnership enquiry" />);
    expect(screen.getByLabelText(/what is your enquiry about/i)).toHaveValue("partnership");
    expect(screen.getByLabelText(/^subject/i)).toHaveValue("Partnership enquiry");
  });

  it("shows accessible errors and does not submit when fields are invalid", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/please fix these/i);
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute("aria-invalid", "true");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("confirms success only after the API accepts the message", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ detail: "Thank you. Your message has been received." }), { status: 201 })));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByRole("heading", { name: /message received/i })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Thank you. Your message has been received.");
  });

  it("tells the user the message was not sent when the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("Failed to fetch"); }));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/was not sent/i);
    expect(screen.queryByRole("heading", { name: /message received/i })).not.toBeInTheDocument();
  });

  it("shows server-side validation errors against the right field", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ email: ["Enter a valid email address."] }), { status: 400 })));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => expect(screen.getByLabelText(/email address/i)).toHaveAttribute("aria-invalid", "true"));
    expect(screen.getAllByText("Enter a valid email address.").length).toBeGreaterThan(0);
  });
});
