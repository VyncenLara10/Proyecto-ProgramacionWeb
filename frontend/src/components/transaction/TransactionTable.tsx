"use client";

type Transaction = {
  id: number;
  amount: number;
  description: string;
};

const mockData: Transaction[] = [
  { id: 1, amount: 100, description: "Compra oficina" },
  { id: 2, amount: 50, description: "Pago internet" },
];

export default function TransactionTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Monto</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        {mockData.map((tx) => (
          <tr key={tx.id}>
            <td>{tx.id}</td>
            <td>{tx.amount}</td>
            <td>{tx.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
