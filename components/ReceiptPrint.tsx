import React from "react";

export interface ReceiptItem {
  name: string;
  qty: number;
  price: number;
  subTotal: number;
}

export interface ReceiptData {
  invoice: string;
  date: string;
  customer?: string | null;
  items: ReceiptItem[];
  total: number;
  paid: number;
  change: number;
  notes?: string | null;
}

export default function ReceiptPrint({ data }: { data: ReceiptData | null }) {
  if (!data) return null;

  return (
    <div className="hidden print:block text-black bg-white font-mono mx-auto">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { 
            margin: 0; 
            size: 58mm auto; 
          }
          body { 
            margin: 0.2cm; 
          }
        }
      `,
        }}
      />

      <div className="text-center mb-4">
        <h2 className="text-lg font-bold uppercase">Mozza Aquatic</h2>
        <p className="text-[10px] leading-tight">Jl. Contoh Alamat No. 123</p>
        <p className="text-[10px] leading-tight">Telp: 0812-3456-7890</p>
      </div>

      <div className="border-t border-dashed border-black my-2"></div>

      <div className="text-[10px] mb-2 leading-tight">
        <div className="flex justify-between">
          <span>No:</span>
          <span>{data.invoice}</span>
        </div>
        <div className="flex justify-between">
          <span>Tgl:</span>
          <span>{data.date}</span>
        </div>
        {data.customer && (
          <div className="flex justify-between">
            <span>Plg:</span>
            <span>{data.customer}</span>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-black my-2"></div>

      <div className="text-[10px] mb-2">
        {data.items.map((item, idx) => (
          <div key={idx} className="mb-1 leading-tight">
            <div>{item.name}</div>
            <div className="flex justify-between">
              <span>
                {item.qty} x {item.price.toLocaleString("id-ID")}
              </span>
              <span>{item.subTotal.toLocaleString("id-ID")}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-black my-2"></div>

      <div className="text-[10px] font-bold">
        <div className="flex justify-between mb-1">
          <span>TOTAL</span>
          <span>Rp {data.total.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between mb-1 font-normal">
          <span>TUNAI</span>
          <span>Rp {data.paid.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between">
          <span>KEMBALI</span>
          <span>Rp {data.change.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="border-t border-dashed border-black my-2"></div>

      <div className="text-center text-[10px] mt-4 leading-tight">
        {data.notes && (
          <p className="mb-3 italic font-normal text-left whitespace-pre-wrap">
            Catatan: {data.notes}
          </p>
        )}
        <p>Terima Kasih</p>
        <p>Barang yang dibeli tidak</p>
        <p>dapat ditukar/dikembalikan</p>
      </div>
    </div>
  );
}
