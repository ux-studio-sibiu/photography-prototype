import PortfolioPage from "../portfolio-page";

export const revalidate = 60; // seconds

export default function BlackPage() {
  return <PortfolioPage theme="theme-black" />;
}
