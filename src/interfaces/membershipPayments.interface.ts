export interface MembershipPayments {
    id_pago: string;
    id_empresa_membresia: string;
    referencia_pago: string;
    paypal_transaction_id: string;
    payer_email: string;
    monto: number;
    moneda: string;
    estado_pago: string;
    metodo_pago: string;
    respuesta_paypal: string;
    fecha_pago: Date;
}