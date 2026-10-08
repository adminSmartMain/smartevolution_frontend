import NextLink from "next/link";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const PRIMARY_TEAL = "#3b828e";

export default function PageHeader({ breadcrumbs = [], actions = null, compact = false }) {
  const fontSize = compact ? { xs: 11.5, md: 12.5 } : { xs: 12, md: 13.5 };

  return (
    <Box
      component="header"
      className="platform-page-header"
      sx={{
        width: "100%",
        mb: { xs: 1.25, md: 1.5 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        minWidth: 0,
      }}
    >
      <Breadcrumbs
        separator="›"
        aria-label="Miga de pan"
        sx={{
          minWidth: 0,
          color: "#66727c",
          "& .MuiBreadcrumbs-separator": { mx: 0.75, color: "#8A969B" },
          "& .MuiBreadcrumbs-ol": { flexWrap: "wrap", alignItems: "center" },
          "& .MuiBreadcrumbs-li, & .MuiBreadcrumbs-separator": {
            display: "inline-flex",
            alignItems: "center",
          },
        }}
      >
        <NextLink href="/dashboard" passHref legacyBehavior>
          <Link
            underline="hover"
            color="inherit"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              fontSize,
              lineHeight: 1.25,
            }}
          >
            <HomeOutlinedIcon sx={{ fontSize: { xs: 15, md: 16 } }} />
            Inicio
          </Link>
        </NextLink>

        {breadcrumbs.map((item, index) => {
          const active = index === breadcrumbs.length - 1;
          const styles = {
            color: active ? PRIMARY_TEAL : "#66727c",
            fontSize,
            lineHeight: 1.25,
            fontWeight: active ? 700 : 400,
          };

          if (item.href && !active) {
            return (
              <NextLink key={`${item.label}-${item.href}`} href={item.href} passHref legacyBehavior>
                <Link underline="hover" sx={styles}>
                  {item.label}
                </Link>
              </NextLink>
            );
          }

          return (
            <Typography key={item.label} sx={styles}>
              {item.label}
            </Typography>
          );
        })}
      </Breadcrumbs>

      {actions ? <Box sx={{ flexShrink: 0 }}>{actions}</Box> : null}
    </Box>
  );
}
