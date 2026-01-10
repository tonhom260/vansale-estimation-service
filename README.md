## init script in mysql container
mysql -u root -padmin12345 vansale_db -e "INSERT INTO Product_Unit_Conversion (product_code, unit_id, conversion_factor) SELECT product_code1, 2, 30 FROM product_order WHERE productcategory IN ('DRINKPRODUCT', 'OISHI_LOAF', 'OISHI_TRADE', 'OISHI_MAN');"
