import { getCompanies } from "@/lib/api/company";
import DataTableDemo from "./data-table";
import { CompanyDto } from "@/lib/api/types";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  const companiesWithLocation = companies?.map((company) => {
    return {
      ...company,
      location: `${company.addressLine1}, ${company.city}, ${company.state}, ${company.postalCode}, ${company.country}`,
    };
  });

  return <DataTableDemo data={companiesWithLocation as CompanyDto[]} />;
}
