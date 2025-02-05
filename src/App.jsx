import React, { useState, useEffect } from "react";
import { Sun, Moon, Calculator } from "lucide-react";

const NumberConverter = () => {
  const [inputType, setInputType] = useState("decimal");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      // Get theme from localStorage or default to system preference
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        // Apply the saved theme immediately
        document.documentElement.classList.toggle(
          "dark",
          savedTheme === "dark"
        );
        return savedTheme;
      }
      // Check system preference
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
      return isDark ? "dark" : "light";
    }
    return "light"; // Default fallback
  });

  useEffect(() => {
    // Update theme in localStorage and DOM when theme changes
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  // Add listener for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  const patterns = {
    binary: /^[0-1]*$/,
    decimal: /^[0-9]*$/,
    hexadecimal: /^[0-9A-Fa-f]*$/,
    octal: /^[0-7]*$/,
  };

  const getBase = (type) => {
    const bases = {
      binary: 2,
      decimal: 10,
      hexadecimal: 16,
      octal: 8,
    };
    return bases[type] || 10;
  };

  const convertNumber = (value, fromBase) => {
    try {
      if (!value)
        return { decimal: "", binary: "", hexadecimal: "", octal: "" };

      const decimal =
        fromBase === "decimal"
          ? parseInt(value)
          : parseInt(value, getBase(fromBase));

      if (isNaN(decimal)) throw new Error("Invalid number");

      return {
        decimal: decimal.toString(),
        binary: decimal.toString(2),
        hexadecimal: decimal.toString(16).toUpperCase(),
        octal: decimal.toString(8),
      };
    } catch (err) {
      setError("Invalid input for selected number system");
      return { decimal: "", binary: "", hexadecimal: "", octal: "" };
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setError("");

    if (!patterns[inputType].test(value)) {
      setError(`Invalid ${inputType} number`);
      return;
    }

    setInputValue(value);
  };

  const results = convertNumber(inputValue, inputType);

  const ResultBox = ({ title, value }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        {title}
      </h3>
      <p className="font-mono text-lg break-all text-gray-800 dark:text-gray-100">
        {value || "0"}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Number System Converter
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Convert between decimal, binary, hexadecimal, and octal number
            systems
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="block w-full sm:w-[180px] px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            >
              <option value="decimal">Decimal</option>
              <option value="binary">Binary</option>
              <option value="hexadecimal">Hexadecimal</option>
              <option value="octal">Octal</option>
            </select>

            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={`Enter ${inputType} number`}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />

              <button
                onClick={toggleTheme}
                className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ResultBox title="Decimal" value={results.decimal} />
          <ResultBox title="Binary" value={results.binary} />
          <ResultBox title="Hexadecimal" value={results.hexadecimal} />
          <ResultBox title="Octal" value={results.octal} />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Real-time conversion • Persistent theme • Responsive design</p>
        </div>
      </div>
    </div>
  );
};

export default NumberConverter;
