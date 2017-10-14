import Expo from 'expo';
import Communications from 'react-native-communications';
import {  formatMoney, formatNumber, unformat } from '../utils/format';
import logoImage from './logo';

export default PurChaseSupplier = (
    supplierName,
    id,
    date,
    oldDebt,
    pay,
    newDebt
) => {    
    
    return `
    <?xml version="1.0" encoding="UTF-8"?>
    
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/TR/xhtml1" xml:lang="vn" lang="vn">
    
    <head>
        <meta charset="utf-8" />
        <title>Báo Giá</title>
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
                    <img width="100%" src="${logoImage}" alt="" />
                </td>
            </tr>
    
        </table>
        <h1 class="title" width: "100%">BÁO GIÁ</h1>
        <table class="orderInfor" width="100%">
            <tr>
                <td width="50%">
                    <h2>Kính gửi Quý Khách ${supplierName}</h2>
                </td>
                <td width="50%">
                    <p>Ngày Lập: ${date}</p>
                </td>
            </tr>
            <tr
                <td width="60%"></td>
                <td>Nợ Cũ: $${oldDebt}</td>
            </tr>
            <tr
                <td width="60%"></td>
                <td>Thanh Toán: $${pay}</td>
            </tr>
            <tr
                <td width="60%"></td>
                <td>Còn Lại: $${newDebt}</td>
            </tr>
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
        padding: 2em;
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
    table.orderDetail td.alignright {
        text-align: right;
    }
    table.orderDetail td.center {
        text-align: center;
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
    `
}

export const sendMessage = (
    supplierPhone,
    supplierName,
    date,
    QuocteDetail,
) => {
    let htmlQuocteDetail = '';
    QuocteDetail.forEach((order) => {        
        htmlQuocteDetail += `${order.name}: ${order.unitName} : ${formatNumber(order.salePrice)}. `
    });
    
    Communications.text(supplierPhone, `Kính gửi Quí Khách ${supplierName} Báo Giá ngày: ${date}: 
    ${htmlQuocteDetail}    
    `);
}
export const sendEmail = (
    supplierEmail,
    supplierName,
    date,
    QuocteDetail,
) => {
    let htmlQuocteDetail = '';
    QuocteDetail.forEach((order) => {
        htmlQuocteDetail += `${order.name}: ${order.unitName} x ${formatNumber(order.salePrice)}.
        `
    });
    Communications.email([supplierEmail], null, null, 'Báo Giá', `Kính gửi Quí Khách ${supplierName}
    
    
        Báo Giá ngày: ${date}: 

        ${htmlQuocteDetail}
    `);
}
