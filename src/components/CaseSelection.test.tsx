import { render, screen, fireEvent } from "@testing-library/react";
import CaseSelection from "./CaseSelection"; // Ajusta la ruta según tu estructura de carpetas

const mockOptions = [
  { value: "case1", label: "Caso 1" },
  { value: "case2", label: "Caso 2" },
  { value: "case3", label: "Caso 3" },
];

describe("CaseSelection Component", () => {
  test("renders with no selected option", () => {
    render(
      <CaseSelection
        options={mockOptions}
        selectedOption=""
        onSelect={() => {}}
      />
    );

    const buttonElement = screen.getByRole("combobox");
    expect(buttonElement).toMatch(/Selecciona un caso de uso.../);
  });

  test("renders with a selected option", () => {
    render(
      <CaseSelection
        options={mockOptions}
        selectedOption="case1"
        onSelect={() => {}}
      />
    );

    const buttonElement = screen.getByRole("combobox");
    expect(buttonElement).toMatch(/Caso 1/);
  });

  test("opens the popover when the button is clicked", () => {
    render(
      <CaseSelection
        options={mockOptions}
        selectedOption=""
        onSelect={() => {}}
      />
    );

    const buttonElement = screen.getByRole("combobox");
    fireEvent.click(buttonElement);

    expect(screen.getByPlaceholderText("Buscar caso de uso...")).toBeTruthy();
  });

  test("calls onSelect with the correct value when an option is selected", () => {
    const mockOnSelect = jest.fn();
    render(
      <CaseSelection
        options={mockOptions}
        selectedOption=""
        onSelect={mockOnSelect}
      />
    );

    fireEvent.click(screen.getByRole("combobox")); // Abre el popover

    const caseOption = screen.getByText("Caso 2");
    fireEvent.click(caseOption); // Selecciona "Caso 2"

    expect(mockOnSelect).toHaveBeenCalledWith("case2");
  });

  test("closes the popover after selecting an option", () => {
    const { getByRole, getByText } = render(
      <CaseSelection
        options={mockOptions}
        selectedOption=""
        onSelect={() => {}}
      />
    );

    const buttonElement = getByRole("combobox");
    fireEvent.click(buttonElement); // Abre el popover

    expect(getByText("Caso 1")).toBeNull(); // No se muestra "Caso 1"

    fireEvent.click(getByText("Caso 1")); // Selecciona "Caso 1"

    expect(screen.queryByPlaceholderText("Buscar caso de uso...")).toBeNull(); // No se muestra el input de búsqueda
  });
});
