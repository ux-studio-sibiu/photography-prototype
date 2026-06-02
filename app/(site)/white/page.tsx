import PortfolioPage from "../portfolio-page";
import "./white.scss";

export const revalidate = 60; // seconds

export default function WhitePage() {
  return <PortfolioPage theme="theme-white" />;
}
