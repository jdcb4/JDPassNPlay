import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { HomePage } from "@/features/home/HomePage";

describe("HomePage", () => {
  it("lists the bundled party games", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /Party games/i })).toBeInTheDocument();
    expect(screen.getByText(/Who What Where/i)).toBeInTheDocument();
    expect(screen.getByText(/Hat Game/i)).toBeInTheDocument();
    expect(screen.getByText(/Imposter/i)).toBeInTheDocument();
  });
});
