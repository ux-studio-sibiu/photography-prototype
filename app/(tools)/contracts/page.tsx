import type { Metadata } from "next";
import { getContractTemplates } from "@/sanity/sanity.query";
import ContractGenerator from "./contract-generator";
import "./contracts.scss";

export const metadata: Metadata = {
  title: "Contract Generator",
};

export default async function ContractsPage() {
  const templates = await getContractTemplates();

  return (
    <main className="contract-tool">
      <ContractGenerator templates={templates} />
    </main>
  );
}
