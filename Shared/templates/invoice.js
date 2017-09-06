import Expo from 'expo';
import {  formatMoney, formatNumber, unformat } from '../utils/format';
export default Invoice = (
    customerName,
    id,
    date,
    total,
    totalIncludeVat,
    vat,
    oldDebt,
    pay,
    newDebt,
    OrderDetail,
    logo
) => {
    let htmlOrderDetail = '';
    OrderDetail.forEach((order) => {
        const totalPrice = order.salePrice * order.quantity;
        htmlOrderDetail += `
        <tr>
            <td><span >${order.name}</span></td>
            <td style = "text-align: center;"><span data-prefix></span><span >${formatNumber(order.quantity)}</span></td>
            <td style = "text-align: center;"><span >${order.unitName}</span></td>
            <td style = "text-align: right;"><span data-prefix></span><span>${formatNumber(order.salePrice)}</span></td>
            <td style = "text-align: right;"><span data-prefix></span><span>${formatNumber(totalPrice)}</span></td>
        </tr>
        `
    });
    return `
    <html>
    
    <head>
        <meta charset="utf-8"/>
        <title>Hóa Đơn</title>
        <style>
        * {
			font-family: "VU Arial";
			border: 0;
			box-sizing: content-box;
			color: inherit;
			font-family: inherit;
			font-size: inherit;
			font-style: inherit;
			font-weight: inherit;
			line-height: inherit;
			list-style: none;
			margin: 0;
			padding: 0;
			text-decoration: none;
			vertical-align: top;
		}
		/* heading */

		h1 {
			font: bold 22px "VU Arial";
			letter-spacing: 0.5em;
			text-align: center;
			text-transform: uppercase;
		}
		/* table */
		table {
			font-size: 75%;
			table-layout: fixed;
			width: 100%;
			border-collapse: separate;
			border-spacing: 2px;
		}

		th,
		td {
			border-width: 1px;
			padding: 0.5em;
			position: relative;
			text-align: left;
		}

		th,
		td {
			border-style: solid;
		}

		th {
			background: #EEE;
			border-color: #BBB;
		}

		td {
			border-color: #DDD;
		}
		/* page */

		html {
			font: 16px/1 'Open Sans', "VU Arial";
			overflow: auto;
			padding: 0.5in;
		}

		html {
			background: #999;
			cursor: default;
		}

		body {
			font-family: "VU Arial";
			box-sizing: border-box;
			height: 11in;
			margin: 0 auto;
			overflow: hidden;
			padding: 0.5in;
			width: 8.5in;
		}

		body {
			background: #FFF;
			border-radius: 1px;
			box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
		}


		@media print {
			* {
				-webkit-print-color-adjust: exact;
			}
			html {
				background: none;
				padding: 0;
			}
			body {
				box-shadow: none;
				margin: 0;
			}
			span:empty {
				display: none;
			}
		}

		@page {
			margin: 0;
		}
        </style>
    </head>
    
    <body>
    <header style = "display: table;">    
        <address style = "float: left; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0;" >
            <p style = "margin: 0 0 0.25em; font-weight: bold;">CÔNG TY CỔ PHẦN KIM KHÍ HÓA CHẤT CÁT TƯỜNG</p>
            <p style = "margin: 0 0 0.25em;">Địa chỉ: 152 Giải Phóng - Cửa Bắc - Nam Định</p>
            <p style = "margin: 0 0 0.25em;">Điệnthoại: 0912250315 - 0916698845 - 0916678845</p>
            <p style = "margin: 0 0 0.25em;">email: sale@soncattuong.com</p>
            <p style = "margin: 0 0 0.25em;">website: www.soncattuong.com</p>
        </address>
        <span>
            <span><img style = "display: block;	float: right; max-height: 20%; max-width: 20%;" alt="" src="${logo}"></span>
        </span>
    </header>
    <h1 style="font-size: 20px; background:dimgrey; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0;">Hóa Đơn</h1>
    <article>
        <address style = "style = "float: left; font-size: 125%; font-weight: bold;">
            <p>${customerName}</p>
        </address>
        <table style="float: right; width: 36%; margin-bottom: 20px">
            <tr>
                <th><span >Số Hóa Đơn #</span></th>
                <td><span >${id}</span></td>
            </tr>
            <tr>
                <th><span >Ngày Lập</span></th>
                <td><span >${date}</span></td>
            </tr>

        </table>
        <table style = "clear: both; width: 100%;">
            <thead style = "font-weight: bold; text-align: center;">
                <tr>
                    <th style = "width: 220px"><span >Tên sản phẩm</span></th>
                    <th style = "width: 75px"><span >Số lượng</span></th>
                    <th style = "width: 90px"><span >Qui cách</span></th>
                    <th style = "width: 110px"><span >Giá bán</span></th>
                    <th><span >Thành Tiền</span></th>
                </tr>
            </thead>
            <tbody>
                ${htmlOrderDetail}
            </tbody>
        </table>
        <table style = "width: 50%; margin-bottom: 10px; float:right">
            <tr>
                <th><span >Tổng Tiền</span></th>
                <td style = "text-align: right;"><span data-prefix></span><span>${formatNumber(total)}</span></td>
            </tr>
            <tr>
                <th><span >VAT</span></th>
                <td style = "text-align: right;"><span data-prefix></span><span >${formatNumber(vat)}</span></td>
            </tr>
            <tr>
                <th><span >Tổng tiền (gồm vat)</span></th>
                <td><span data-prefix></span><span>${formatNumber(totalIncludeVat)}</span></td>
            </tr>
            <tr>
                <th><span >Nợ cũ</span></th>
                <td style = "text-align: right;"><span data-prefix></span><span>${formatNumber(oldDebt)}</span></td>
            </tr>
            <tr>
                <th><span >Thanh Toán</span></th>
                <td style = "text-align: right;"><span data-prefix></span><span>${formatNumber(pay)}</span></td>
            </tr>
            <tr>
                <th><span >Còn lại</span></th>
                <td style = "text-align: right;"><span data-prefix></span><span>${formatNumber(newDebt)}</span></td>
            </tr>
        </table>
    </article>
    <table>
        <thead>
            <tr>
                <th style = "text-align: center; font-weight: bold;"><span >Người Nhận</span></th>
                <th style = "text-align: center; font-weight: bold;"><span >Thủ Kho</span></th>
                <th style = "text-align: center; font-weight: bold;"><span >Người Bán</span></th>
            </tr>
        </thead>
    </table>
</body>
    
    </html>
    `
}