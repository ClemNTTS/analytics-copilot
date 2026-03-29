"use client";

import React, { useState } from "react";

type Customer = {
  id: number;
  code: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phone: string | null;
  address_city: string | null;
  entity_type: string | null;
  created: string | null;
};

type Subscription = {
  id: number;
  user_account_id: number;
  code: string;
  description: string | null;
  status: string;
  mrr: string | number | null;
  subscription_date: string | null;
  termination_date: string | null;
  seller_id: number | null;
};

type Invoice = {
  id: number;
  subscription_id: number | null;
  invoice_number: string;
  amount_with_tax: string | number | null;
  amount_without_tax: string | number | null;
  status: string;
  payment_method: string | null;
  invoice_date: string | null;
  due_date: string | null;
};

type Props = {
  customers: Customer[];
  subscriptions: Subscription[];
  invoices: Invoice[];
};

export default function DatabaseClientPage({
  customers,
  subscriptions,
  invoices,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    "customers" | "subscriptions" | "invoices"
  >("customers");

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "N/A";
    }

    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: string | number | null) => {
    if (amount === null || amount === undefined) {
      return "N/A";
    }

    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(Number(amount));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 text-foreground transition-colors duration-300 sm:p-8">
      <header className="mx-auto mb-8 max-w-7xl">
        <h1 className="mb-2 text-4xl font-black tracking-tight">
          Data Preview
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
          Exploration rapide du dataset PostgreSQL utilise par l&apos;assistant.
        </p>
      </header>

      <div className="mx-auto mb-6 max-w-7xl px-4">
        <div className="flex gap-4 overflow-x-auto border-b-4 border-card-border whitespace-nowrap">
          <button
            onClick={() => setActiveTab("customers")}
            className={`relative px-6 pb-4 text-sm font-black uppercase tracking-tighter transition-all ${
              activeTab === "customers" ? "text-blue-700" : "text-zinc-400"
            }`}
          >
            Clients ({customers.length})
            {activeTab === "customers" && (
              <div className="absolute right-0 bottom-[-4px] left-0 h-1 bg-blue-700" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`relative px-6 pb-4 text-sm font-black uppercase tracking-tighter transition-all ${
              activeTab === "subscriptions" ? "text-blue-700" : "text-zinc-400"
            }`}
          >
            Abonnements ({subscriptions.length})
            {activeTab === "subscriptions" && (
              <div className="absolute right-0 bottom-[-4px] left-0 h-1 bg-blue-700" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`relative px-6 pb-4 text-sm font-black uppercase tracking-tighter transition-all ${
              activeTab === "invoices" ? "text-blue-700" : "text-zinc-400"
            }`}
          >
            Factures ({invoices.length})
            {activeTab === "invoices" && (
              <div className="absolute right-0 bottom-[-4px] left-0 h-1 bg-blue-700" />
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="w-full overflow-hidden overflow-x-auto rounded-xl border-2 border-card-border bg-card shadow-xl">
          <table className="w-full min-w-[1200px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-card-border bg-zinc-300/50">
                {activeTab === "customers" ? (
                  <>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      ID / Code
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Nom complet
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Email / Telephone
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Ville
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Type
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Date de creation
                    </th>
                  </>
                ) : activeTab === "subscriptions" ? (
                  <>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Client / Code
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Description
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      MRR
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Etat
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Seller ID
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Periode
                    </th>
                  </>
                ) : (
                  <>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Numero / Abonnement
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Montant TTC
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Montant HT
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Etat / Methode
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Date facture
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                      Echeance
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-card-border/30">
              {activeTab === "customers"
                ? customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="transition-colors hover:bg-zinc-400/10"
                    >
                      <td className="p-5">
                        <div className="font-mono text-xs font-black text-blue-700">
                          {customer.id}
                        </div>
                        <div className="text-[10px] font-bold uppercase opacity-60">
                          {customer.code}
                        </div>
                      </td>
                      <td className="p-5 text-base font-black text-foreground">
                        {customer.firstname} {customer.lastname}
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-bold text-foreground opacity-80">
                          {customer.email}
                        </div>
                        <div className="text-xs opacity-60">
                          {customer.phone || "Non renseigne"}
                        </div>
                      </td>
                      <td className="p-5 text-sm font-bold text-foreground opacity-80">
                        {customer.address_city || "N/A"}
                      </td>
                      <td className="p-5">
                        <span
                          className={`rounded-md px-3 py-1 text-[10px] font-bold uppercase ${
                            customer.entity_type === "COMPANY"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-zinc-200 text-zinc-800"
                          }`}
                        >
                          {customer.entity_type}
                        </span>
                      </td>
                      <td className="p-5 text-sm font-bold text-foreground opacity-80">
                        {formatDate(customer.created)}
                      </td>
                    </tr>
                  ))
                : activeTab === "subscriptions"
                  ? subscriptions.map((subscription) => (
                      <tr
                        key={subscription.id}
                        className="transition-colors hover:bg-zinc-400/10"
                      >
                        <td className="p-5">
                          <div className="font-mono text-xs font-black text-blue-700">
                            Client: {subscription.user_account_id}
                          </div>
                          <div className="text-[10px] font-black uppercase text-foreground">
                            {subscription.code}
                          </div>
                        </td>
                        <td className="p-5 text-sm font-bold text-foreground opacity-90">
                          {subscription.description || "Pas de description"}
                        </td>
                        <td className="p-5 text-lg font-black text-emerald-700">
                          {formatCurrency(subscription.mrr)}
                        </td>
                        <td className="p-5">
                          <span
                            className={`rounded-lg border-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm ${
                              subscription.status === "ACTIVE"
                                ? "border-green-700 bg-green-600 text-white"
                                : subscription.status === "TERMINATED"
                                  ? "border-red-700 bg-red-600 text-white"
                                  : "border-yellow-600 bg-yellow-500 text-white"
                            }`}
                          >
                            {subscription.status}
                          </span>
                        </td>
                        <td className="p-5 font-mono text-xs font-bold opacity-70">
                          #{subscription.seller_id}
                        </td>
                        <td className="p-5 text-sm">
                          <div className="font-bold text-foreground">
                            Du: {formatDate(subscription.subscription_date)}
                          </div>
                          <div className="text-xs opacity-50">
                            Au: {formatDate(subscription.termination_date)}
                          </div>
                        </td>
                      </tr>
                    ))
                  : invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="transition-colors hover:bg-zinc-400/10"
                      >
                        <td className="p-5">
                          <div className="text-base font-black text-foreground">
                            {invoice.invoice_number}
                          </div>
                          <div className="font-mono text-[10px] font-bold text-blue-700">
                            Abo: #{invoice.subscription_id}
                          </div>
                        </td>
                        <td className="p-5 text-lg font-black text-emerald-700">
                          {formatCurrency(invoice.amount_with_tax)}
                        </td>
                        <td className="p-5 font-bold text-zinc-600">
                          {formatCurrency(invoice.amount_without_tax)}
                        </td>
                        <td className="p-5">
                          <div className="mb-1">
                            <span
                              className={`rounded-lg border-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                invoice.status === "PAID"
                                  ? "border-green-700 bg-green-600 text-white"
                                  : invoice.status === "UNPAID"
                                    ? "border-yellow-600 bg-yellow-500 text-white"
                                    : "border-red-700 bg-red-600 text-white"
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </div>
                          <div className="text-[10px] font-bold uppercase opacity-60">
                            {invoice.payment_method}
                          </div>
                        </td>
                        <td className="p-5 text-sm font-bold text-foreground opacity-80">
                          {formatDate(invoice.invoice_date)}
                        </td>
                        <td className="p-5 text-sm font-bold text-red-800 opacity-80">
                          {formatDate(invoice.due_date)}
                        </td>
                      </tr>
                    ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
