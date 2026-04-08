import "./globals.css";
import StyledComponentsRegistry from "./registry";

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
