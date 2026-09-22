import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/ui/Button";

describe("Button Component", () => {
  it("renders button with children correctly", () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByRole("button", { name: /clique aqui/i })).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Salvar</Button>);

    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<Button disabled>Carregando</Button>);
    const button = screen.getByRole("button", { name: /carregando/i });
    expect(button).toBeDisabled();
  });
});
