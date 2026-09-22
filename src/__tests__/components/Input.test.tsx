import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Input from "@/components/ui/Input";

describe("Input Component", () => {
  it("renders input with label and placeholder", () => {
    render(<Input label="Nome" placeholder="Digite seu nome" />);
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite seu nome")).toBeInTheDocument();
  });

  it("displays error message when provided", () => {
    render(<Input label="Email" error="Email inválido" />);
    expect(screen.getByText("Email inválido")).toBeInTheDocument();
  });

  it("handles value change", () => {
    const handleChange = jest.fn();
    render(<Input aria-label="username" onChange={handleChange} />);

    fireEvent.change(screen.getByRole("textbox", { name: /username/i }), {
      target: { value: "novo-valor" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
