import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { user: null as null | { uid: string }, profile: null as null | { username: string } },
  getTeam: vi.fn(),
  toggle: vi.fn(),
  toast: Object.assign(vi.fn(), { error: vi.fn() }),
}));

vi.mock("../auth-provider", () => ({ useAuth: () => mocks.auth }));
vi.mock("@/lib/teams", () => ({ getTeam: mocks.getTeam, toggleTeamMember: mocks.toggle }));
vi.mock("sonner", () => ({ toast: mocks.toast }));

import AddToTeamButton from "./AddToTeamButton";

const pikachu = { id: 25, name: "pikachu", types: ["electric"], bst: 320 };

beforeEach(() => {
  mocks.auth.user = null;
  mocks.auth.profile = null;
  mocks.getTeam.mockReset().mockResolvedValue(null);
  mocks.toggle.mockReset();
  mocks.toast.mockClear();
  mocks.toast.error.mockClear();
});

describe("AddToTeamButton", () => {
  it("asks signed-out visitors to sign in instead of writing", async () => {
    render(<AddToTeamButton member={pikachu} />);
    await userEvent.click(screen.getByRole("button", { name: /add to team/i }));
    expect(mocks.toast).toHaveBeenCalledWith(expect.stringMatching(/sign in/i));
    expect(mocks.toggle).not.toHaveBeenCalled();
  });

  it("shows the saved state for team members", async () => {
    mocks.auth.user = { uid: "u1" };
    mocks.auth.profile = { username: "Ash" };
    mocks.getTeam.mockResolvedValue({ members: [pikachu] });
    render(<AddToTeamButton member={pikachu} />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /in your team/i })).toHaveAttribute("aria-pressed", "true"),
    );
  });

  it("adds, then removes", async () => {
    mocks.auth.user = { uid: "u1" };
    mocks.auth.profile = { username: "Ash" };
    mocks.toggle.mockResolvedValueOnce("added").mockResolvedValueOnce("removed");
    render(<AddToTeamButton member={pikachu} />);

    await userEvent.click(screen.getByRole("button", { name: /add to team/i }));
    expect(mocks.toggle).toHaveBeenCalledWith("u1", "Ash", pikachu);
    expect(await screen.findByRole("button", { name: /in your team/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /in your team/i }));
    expect(await screen.findByRole("button", { name: /add to team/i })).toHaveAttribute("aria-pressed", "false");
  });

  it("tells the user when the team is full", async () => {
    mocks.auth.user = { uid: "u1" };
    mocks.auth.profile = { username: "Ash" };
    mocks.toggle.mockResolvedValue("full");
    render(<AddToTeamButton member={pikachu} />);
    await userEvent.click(screen.getByRole("button"));
    expect(mocks.toast).toHaveBeenCalledWith(expect.stringMatching(/6 Pokémon/));
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("reports failures without changing state", async () => {
    mocks.auth.user = { uid: "u1" };
    mocks.auth.profile = { username: "Ash" };
    mocks.toggle.mockRejectedValue(new Error("permission-denied"));
    render(<AddToTeamButton member={pikachu} />);
    await userEvent.click(screen.getByRole("button"));
    expect(mocks.toast.error).toHaveBeenCalled();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });
});
