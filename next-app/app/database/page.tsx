import { pool } from "@/src/lib/pool_db";
import DatabaseClientPage from "./DatabaseClientPage";

export const dynamic = "force-dynamic";

async function getCustomers() {
  try {
    const { rows } = await pool.query(
      "SELECT id, code, firstname, lastname, email, phone, address_city, entity_type, created FROM crm_customer ORDER BY id",
    );

    return rows.map((row) => ({
      ...row,
      created: row.created?.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return [];
  }
}

async function getSubscriptions() {
  try {
    const { rows } = await pool.query(
      "SELECT id, user_account_id, code, description, status, mrr, subscription_date, termination_date, seller_id FROM billing_subscription ORDER BY id",
    );

    return rows.map((row) => ({
      ...row,
      subscription_date: row.subscription_date?.toISOString()?.split("T")[0],
      termination_date: row.termination_date?.toISOString()?.split("T")[0],
    }));
  } catch (error) {
    console.error("Failed to fetch subscriptions:", error);
    return [];
  }
}

async function getInvoices() {
  try {
    const { rows } = await pool.query(
      "SELECT id, billing_account_id, subscription_id, invoice_number, invoice_date, due_date, amount_with_tax, amount_without_tax, status, payment_method FROM billing_invoice ORDER BY invoice_date DESC",
    );

    return rows.map((row) => ({
      ...row,
      invoice_date: row.invoice_date?.toISOString()?.split("T")[0],
      due_date: row.due_date?.toISOString()?.split("T")[0],
    }));
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return [];
  }
}

export default async function DatabasePage() {
  const customers = await getCustomers();
  const subscriptions = await getSubscriptions();
  const invoices = await getInvoices();

  return (
    <DatabaseClientPage
      customers={customers}
      subscriptions={subscriptions}
      invoices={invoices}
    />
  );
}
