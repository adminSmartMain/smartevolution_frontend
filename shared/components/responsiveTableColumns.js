const ACTION_COLUMN_PATTERN =
  /(action|acciones|editar|eliminar|borrar|ver\s|imprimir|orden de compra|firma electr[oó]nica|whatsapp|vinculaci[oó]n|trackingAndSync|associatedOperation)/i;

const omitWidth = (column) => {
  const { width, ...rest } = column;
  return rest;
};

/**
 * Normaliza columnas de MUI DataGrid para que aprovechen el ancho disponible
 * sin perder el scroll horizontal cuando la tabla realmente lo necesita.
 *
 * - Las columnas de contenido usan flex + minWidth.
 * - Las columnas de acciones conservan su ancho fijo.
 * - Las columnas que ya definían flex respetan su configuración.
 */
export const responsiveTableColumns = (columns = []) =>
  columns.map((column) => {
    if (!column || typeof column !== "object") return column;

    const label = `${column.field || ""} ${column.headerName || ""}`;
    const isActionColumn =
      column.responsiveFixed === true || ACTION_COLUMN_PATTERN.test(label);

    if (isActionColumn) {
      return {
        ...column,
        width: column.width || column.minWidth || 96,
        minWidth: column.minWidth || Math.min(column.width || 96, 96),
        flex: undefined,
      };
    }

    if (column.flex) {
      return {
        ...column,
        minWidth: column.minWidth || Math.max(88, Math.min(column.width || 140, 180)),
      };
    }

    const basis = column.width || column.minWidth || 140;
    const minWidth = column.minWidth || Math.max(88, Math.min(basis, 180));
    const flex = Math.max(0.75, Math.min(2, basis / 140));

    return {
      ...omitWidth(column),
      minWidth,
      flex,
    };
  });

export default responsiveTableColumns;
