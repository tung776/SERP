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
            <td><span data-prefix></span><span >${formatNumber(order.quantity)}</span></td>
            <td><span >${order.unitName}</span></td>
            <td ><span data-prefix></span><span>${formatNumber(order.salePrice)}</span></td>
            <td><span data-prefix></span><span>${formatNumber(totalPrice)}</span></td>
        </tr>
        `
    });
    return `
    <?xml version="1.0" encoding="UTF-8"?>
    
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/TR/xhtml1" xml:lang="vn" lang="vn">
    
    <head>
        <meta charset="utf-8" />
        <title>Invoice</title>
        <style>
		/* reset */

		* {
			font-family: "VU Arial";
		}

		table {
			border-collapse: collapse;
		}

		.orderDetail th,
		.orderDetail td {
			border-radius: 0.25em;
			border-style: solid;
			border-width: 1px;
			padding: 0.5em;
			position: relative;
			text-align: left;
			border-color: #95a5a6;
		}

		.orderDetail th {
			text-align: center;
		}

		.subTotal {
			float: right;
			margin-bottom: 20px;
		}

		.subTotal td {
			padding: 10px;
			text-align: right;
		}
		
		.subTotal th {
			text-align: left;
		}

		.footer {
			width: 100%;
		}

		.footer td,
		.footer th {
			font-weight: bold;
			text-align: center
		}

		.title {
			padding-left: 45%;
			font-weight: bold;
			background-color: #bdc3c7;
			padding-top: 5px;
			padding-bottom: 5px;
		}

		.companyprofile td {
			text-align: left;
			line-height: 0.5em;
		}

		.orderinfor {
			text-align: center;
			font-weight: bold;
        }
        .cell {
            padding: 5;
            border: 1px solid #95a5a6;
        }
        .subtotalcell {
            padding: 5;
            border-bottom: 1px solid #95a5a6;
        }
	</style>
    </head>
    
    <body>	
        <table class = "companyprofile" width="100%">
            <tr>
                <td width = "75%">
                <h3>CÔNG TY CỔ PHẦN KIM KHÍ HÓA CHẤT CÁT TƯỜNG</h3>			
                <p>Địa chỉ: 152 Giải Phóng - Cửa Bắc - Nam Định</p>
                <p>phone: 0912.250.315 - 0916.698.845 - 0916.678.845</p>
                <p>website: www.soncattuong.com</p>
            </td>
            <td width = "25%">
                <img width="100%" src="file:///data/user/0/com.soncattuong.serp/files/ExperienceData/%40tung776%2Fserp/logo.png" alt=""/>
            </td>    
            </tr>    
        </table>
        <h1 class = "title" width: "100%">HÓA ĐƠN</h1>
        <table width = "100%">
            <tr>
                <td width = "33%">
                    <h2>${customerName}</h2>
                </td>
                <td width = "33%">
                </td>
                <td width = "34%">
                    <p >Ngày Lập: ${date}</p>
                    <p>Số Hóa Đơn: ${id}</p>
                </td>
            </tr>
        </table>
    
    
        <table class="orderDetail" width="100%" border="1" cellpadding="1" cellspacing="2">
            <thead>
                <tr>
                    <th class = "cell">
                        <p><strong>Tên sản phẩm</strong></p>
                    </th>
                    <th class = "cell">
                        <p><strong>Số lượng</strong></p>
                    </th>
                    <th class = "cell">
                        <p><strong>Qui cách</strong></p>
                    </th>
                    <th class = "cell">
                        <p><strong>Giá bán</strong></p>
                    </th>
                    <th class = "cell">
                        <p><strong>Thành Tiền</strong></p>
                    </th>
                </tr>
            </thead>
            <tbody>
                ${htmlOrderDetail}    
            </tbody>
        </table>
        <table class="subTotal" width="100%">
            <tr>
                <td width = "40%"></td>
                <td class = "subtotalcell" width = "25%"><span>Tổng Tiền</span></td>
                <td class = "subtotalcell" width = "35%"><span></span><span>${formatNumber(total)}</span></td>
            </tr>
            <tr>
                <td width = "40%"></td>
                <td class = "subtotalcell" width = "25%"><span>VAT</span></td>
                <td class = "subtotalcell" width = "35%"><span></span><span>${formatNumber(vat)}</span></td>
            </tr>
            <tr>
                <td width = "40%"></td>
                <td class = "subtotalcell" width = "25%"><span>Tổng tiền (gồm vat)</span></td>
                <td class = "subtotalcell" width = "35%"><span></span><span>${formatNumber(totalIncludeVat)}</span></td>
            </tr>
            <tr>
                <td width = "40%"></td>
                <td class = "subtotalcell" width = "25%"><span>Nợ cũ</span></td>
                <td class = "subtotalcell" width = "35%"><span></span><span>${formatNumber(oldDebt)}</span></td>
            </tr>
            <tr>
                <td width = "40%"></td>
                <td class = "subtotalcell" width = "25%"><span>Thanh Toán</span></td>
                <td class = "subtotalcell" width = "35%"><span></span><span>${formatNumber(pay)}</span></td>
            </tr>
            <tr>
                <td width = "40%"></td>
                <td class = "subtotalcell" width = "25%"><span>Còn lại</span></td>
                <td class = "subtotalcell" width = "35%"><span></span><span>${formatNumber(newDebt)}</span></td>
            </tr>
        </table>
    
        <table class="footer">
            <thead>
                <tr>
                    <th><span>Người Nhận</span></th>
                    <th><span>Thủ Kho</span></th>
                    <th><span>Người Bán</span></th>
                </tr>
            </thead>
        </table>
    </body>
    
    </html>
    `
}