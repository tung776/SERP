import Expo from 'expo';
import Communications from 'react-native-communications';
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
            <td>${order.name}</td>
            <td style = "text-align: center;">${formatNumber(order.quantity)}</td>
            <td style = "text-align: center;">${order.unitName}</td>
            <td id = "alignright" style = "text-align: right;">${formatNumber(order.salePrice)}</td>
            <td id = "alignright" style = "text-align: right;">${formatNumber(totalPrice)}</td>
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
    </head>
    
    <body>
        <table class="companyProfile" width="100%">
            <tr>
                <td width="75%">
                    <h3>CÔNG TY CỔ PHẦN KIM KHÍ HÓA CHẤT CÁT TƯỜNG</h3>
                    <p>Địa chỉ: 152 Giải Phóng - Cửa Bắc - Nam Định</p>
                    <p>phone: 0912.250.315 - 0916.698.845 - 0916.678.845</p>
                    <p>website: www.soncattuong.com</p>
                </td>
                <td width="25%">
                    <img width="100%" src="${logo}" alt="" />
                </td>
            </tr>
    
        </table>
        <h1 class="title" width: "100%">HÓA ĐƠN</h1>
        <table class="orderInfor" width="100%">
            <tr>
                <td width="50%">
                    <h2>${customerName}</h2>
                </td>
                <td width="50%">
                    <p>Ngày Lập: ${date}</p>
                    <p>Số Hóa Đơn: ${id}</p>
                </td>
            </tr>
        </table>
    
    
        <table class="orderDetail" width="100%">
            <thead>
                <tr>
                    <th>
                        <p><strong>Tên sản phẩm</strong></p>
                    </th>
                    <th>
                        <p><strong>Số lượng</strong></p>
                    </th>
                    <th>
                        <p><strong>Qui cách</strong></p>
                    </th>
                    <th>
                        <p><strong>Giá bán</strong></p>
                    </th>
                    <th>
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
                <th width="40%"></th>
                <td width="30%"><span>Tổng Tiền</span></td>
                <td width="25%"><span></span><span>${formatNumber(total)}</span></td>
            </tr>
            <tr>
                <th width="40%"></th>
                <td width="30%"><span>VAT</span></td>
                <td width="30%"><span></span><span>${formatNumber(vat)}</span></td>
            </tr>
            <tr>
                <th width="40%"></th>
                <td width="30%"><span>Tổng tiền (gồm vat)</span></td>
                <td width="30%"><span></span><span>${formatNumber(totalIncludeVat)}</span></td>
            </tr>
            <tr>
                <th width="40%"></th>
                <td width="30%"><span>Nợ cũ</span></td>
                <td width="30%"><span></span><span>${formatNumber(oldDebt)}</span></td>
            </tr>
            <tr>
                <th width="40%"></th>
                <td width="30%"><span>Thanh Toán</span></td>
                <td width="30%"><span></span><span>${formatNumber(pay)}</span></td>
            </tr>
            <tr>
                <th width="40%"></th>
                <td width="30%"><span>Còn lại</span></td>
                <td width="30%"><span></span><span>${formatNumber(newDebt)}</span></td>
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

export const css = () => {
    return `
    * {
        font-family: "VU Arial";
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

    table {
        border-collapse: collapse;
    }

    table.orderDetail th,
    table.orderDetail td {
        border-style: solid;
        border-width: 1px;
        padding: 1.5em;
        text-align: left;
        border-color: #7f8c8d;
    }

    table.orderDetail th {
        text-align: center;
    }

    table.orderDetail tr:nth-child(even) {
        background-color: #dddddd;
    }

    table.orderDetail td:nth-child(1) {
        width: 32%;
    }

    table.orderDetail td:nth-child(2) {
        text-align: center;
        width: 12%;
    }

    table.orderDetail td:nth-child(3) {
        text-align: center;
        width: 15%;
    }

    table.orderDetail td:nth-child(4) {
        text-align: right;
        width: 18%;
    }

    table.orderDetail td:nth-child(5) {
        text-align: right;
        width: 23%;
    }

    table.subTotal {
        float: right;
        margin-bottom: 20px;
    }

    table.subTotal tr:nth-child(even) td {
        background-color: #dddddd;
        
    }
    table.subTotal tr:nth-child(even),
    table.subTotal th:nth-child(2) {
        background-color: #dddddd;			
    }
    table.subTotal th:nth-child(2),
     table.subTotal td  {
        border-bottom: 1px solid #95a5a6;			
    }

    table.subTotal td {
        padding: 10px;
        text-align: right;
    }
    
    table.subTotal th {
        text-align: left;
    }

    table.footer {
        width: 100%;
    }

    table.footer td,
    th {
        font-weight: bold;
        text-align: center
    }

    .title {
        width: 100%;
        text-align: center;
        font-weight: bold;
    }

    table.companyProfile td {
        text-align: left;
        line-height: 1em;
    }

    table.orderInfor {
        text-align: center;
        font-weight: bold;
        margin-bottom: 20px;
    }
    #alignright {
        text-align: right;
    }
    `
}

export const sendMessage = (
    customerPhone,
    customerName,
    date,
    total,
    totalIncludeVat,
    vat,
    oldDebt,
    pay,
    newDebt,
    OrderDetail,
) => {
    let htmlOrderDetail = '';
    let totalPrice = 0;
    OrderDetail.forEach((order) => {
        totalPrice = order.salePrice * order.quantity;
        htmlOrderDetail += `${order.name}: ${formatNumber(order.quantity)} ${order.unitName} x ${formatNumber(order.salePrice)}. `
    });
    let totalIncludeVatText = '';
    if(vat > 0) totalIncludeVatText = `Tổng tiền gồm VAT: ${formatNumber(totalIncludeVat)},`
    Communications.text(customerPhone, `Kính gửi Quí Khách ${customerName} Hóa Đơn ngày: ${date}: 
    ${htmlOrderDetail}
    Tổng tiền: ${formatNumber(total)}, ${totalIncludeVatText} Nợ cũ: ${formatNumber(oldDebt)}, Thanh Toán: - ${formatNumber(pay)}, Còn Lại: ${formatNumber(newDebt)}
    `);
}
export const sendEmail = (
    customerEmail,
    customerName,
    date,
    total,
    totalIncludeVat,
    vat,
    oldDebt,
    pay,
    newDebt,
    OrderDetail,
) => {
    let htmlOrderDetail = '';
    let totalPrice = 0;
    OrderDetail.forEach((order) => {
        totalPrice = order.salePrice * order.quantity;
        htmlOrderDetail += `${order.name}: ${formatNumber(order.quantity)} ${order.unitName} x ${formatNumber(order.salePrice)} = ${formatNumber(totalPrice)}.
        `
    });
    let totalIncludeVatText = '';
    if(vat > 0) totalIncludeVatText = `Tổng tiền gồm VAT: ${totalIncludeVat},`
    Communications.email([customerEmail], null, null, 'Hóa Đơn', `Kính gửi Quí Khách ${customerName}
    
    
        Hóa Đơn ngày: ${date}: 

        ${htmlOrderDetail}

        Tổng tiền: ${formatNumber(total)}
        ${totalIncludeVatText} 
        Nợ cũ: ${formatNumber(oldDebt)}
        Thanh Toán: - ${formatNumber(pay)}
        Còn Lại: ${formatNumber(newDebt)}
    `);
}