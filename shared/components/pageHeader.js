import NextLink from "next/link";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const PRIMARY_TEAL = "#3b828e";

export default function PageHeader({ title, subtitle, breadcrumbs = [], actions = null }) {
  return (
    <Box
      component="header"
      className="platform-page-header"
      sx={{ width: "100%", mb: { xs: 2, md: 2.5 } }}
    >
      <Breadcrumbs
        separator="›"
        aria-label="Miga de pan"
        sx={{
          mb: { xs: 1, md: 1.25 },
          color: "#66727c",
          "& .MuiBreadcrumbs-separator": { mx: 1, color: "#78838c" },
          "& .MuiBreadcrumbs-ol": { flexWrap: "wrap", alignItems: "center" },
          "& .MuiBreadcrumbs-li, & .MuiBreadcrumbs-separator": { display: "inline-flex", alignItems: "center" },
        }}
      >
        <NextLink href="/dashboard" passHref legacyBehavior>
          <Link
            underline="hover"
            color="inherit"
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.625, fontSize: { xs: 14, md: 16 } }}
          >
            <HomeOutlinedIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
            Inicio
          </Link>
        </NextLink>
        {breadcrumbs.map((item, index) => {
          const active = index === breadcrumbs.length - 1;
          const styles = {
            color: active ? PRIMARY_TEAL : "#66727c",
            fontSize: { xs: 14, md: 16 },
            fontWeight: active ? 700 : 400,
          };

          if (item.href && !active) {
            return (
              <NextLink key={`${item.label}-${item.href}`} href={item.href} passHref legacyBehavior>
                <Link underline="hover" sx={styles}>{item.label}</Link>
              </NextLink>
            );
          }

          return <Typography key={item.label} sx={styles}>{item.label}</Typography>;
        })}
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            sx={{
              color: "#111315",
              fontSize: { xs: 26, md: 36 },
              fontWeight: 400,
              lineHeight: 1.12,
              letterSpacing: 0,
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{
                mt: 0.5,
                color: "#66727c",
                fontSize: { xs: 15, md: 17 },
                lineHeight: 1.35,
                letterSpacing: 0,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
      </Box>
    </Box>
  );
}
