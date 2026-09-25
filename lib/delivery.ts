export type DeliveryOption = { id: string; label: string; fee: number; pickup?: boolean };

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: "centro", label: "Centro", fee: 5 },
  { id: "brejatuba", label: "Brejatuba", fee: 8 },
  { id: "coroados", label: "Coroados", fee: 12 },
  { id: "retirada", label: "Retirar na Loja", fee: 0, pickup: true },
];
