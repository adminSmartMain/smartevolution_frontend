import { Box, useMediaQuery } from "@mui/material";
import { ClientTableDesktop } from "./ClientTableDesktop";
import { ClientTableMobile } from "./ClientTableMobile";

export const ClientTableComponent = ({
  rows,
  columns,
  loading,
  dataCount,
  page,
  setPage,
  fetch,
  filter,
  query,
}) => {
  const isMobile = useMediaQuery("(max-width:899px)", { noSsr: true });

  return (
    <Box width="100%" mt={4}>
      {isMobile ? (
        <ClientTableMobile rows={rows} />
      ) : (
        <ClientTableDesktop
          rows={rows}
          columns={columns}
          loading={loading}
          dataCount={dataCount}
          page={page}
          setPage={setPage}
          fetch={fetch}
          filter={filter}
          query={query}
        />
      )}
    </Box>
  );
};

