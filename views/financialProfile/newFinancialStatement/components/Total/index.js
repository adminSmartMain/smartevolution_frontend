import { Box, InputLabel, Typography } from "@mui/material";

export default (props) => {
  const {
    value,
    total,
    period,
    indexPeriod,
    verticalTotal,
    horizontalTotal,
    isLabelColumn,
    formik,
    group,
    isEditing,
  } = props;

  const formatOptions = {
    style: "currency",
    currency: "USD",
  };
  const numberFormat = new Intl.NumberFormat("en-US", formatOptions);
  return (
    <Box
      display="flex"
      flexDirection="row"
      width="100%"
      height="42.5px"
      alignItems="center"
      bgcolor={!isLabelColumn ? "#CFDDDD" : ""}
    >
      <Box
        display="flex"
        flexDirection="row"
        width="100%"
        ml="0%"
        padding="10px 0px"
        alignItems="center"
        justifyContent={indexPeriod !== 0 ? "space-around" : "space-between"}
      >
        {isLabelColumn ? (
          <InputLabel
            sx={{
              marginLeft: "3%",
              width: "100%",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              font: "normal normal bold 12px/15px Montserrat",
              letterSpacing: "0px",
              color: "#63595C",
              textTransform: "uppercase",
              opacity: 1,
            }}
          >
            <span>{total.title}</span>
          </InputLabel>
        ) : (
          <>
            <Typography
              width={indexPeriod !== 0 ? "40%" : "55%"}
              letterSpacing={0}
              fontSize="1.1vw"
              fontWeight="500"
              color="#488B8F"
              textAlign="right"
              id="income_before_taxes-first_period"
            >
              {numberFormat.format(total.operation(period))}
            </Typography>
            <Typography
              letterSpacing={0}
              fontSize="1.1vw"
              fontWeight="500"
              color="#488B8F"
              textAlign="right"
              width="24%"
            >
              {!isNaN(parseFloat(verticalTotal)) ? verticalTotal + "%" : ""}
            </Typography>
            {indexPeriod !== 0 ? (
              <Typography
                letterSpacing={0}
                fontSize="1.1vw"
                fontWeight="500"
                color="#488B8F"
                textAlign="right"
                width="24%"
              >
                {!isNaN(parseFloat(horizontalTotal))
                  ? horizontalTotal + "%"
                  : ""}
              </Typography>
            ) : null}
          </>
        )}
      </Box>
    </Box>
  );
};
