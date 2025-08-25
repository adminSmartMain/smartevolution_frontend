
import { toast } from 'react-toastify'; // Asegúrate de tener instalada esta librería
// Función auxiliar para validar retenciones
const validateRetentions = (values, newValue, fieldName) => {
  const totalFactura = Number(values.subTotal) + Number(values.iva || 0);
  const otrasRetenciones = 
    Number(values.ret_iva || 0) + 
    Number(values.ret_ica || 0) + 
    Number(values.ret_fte || 0) + 
    Number(values.other_ret || 0);
  
  // Calcular el total de retenciones incluyendo el nuevo valor
  let totalRetenciones = otrasRetenciones;
  
  if (fieldName === 'ret_fte') {
    totalRetenciones += Number(newValue);
  } else if (fieldName === 'ret_ica') {
    totalRetenciones += Number(newValue);
  } else if (fieldName === 'ret_iva') {
    totalRetenciones += Number(newValue);
  } else if (fieldName === 'other_ret') {
    totalRetenciones += Number(newValue);
  }
  
  // Validar si las retenciones superan el total de la factura
  if (totalRetenciones > totalFactura) {
    toast.error('Las retenciones e IVA no pueden ser mayores al saldo de la factura');
    return false;
  }
  
  return true;
};

export default validateRetentions;