import Expo from 'expo';
import Communications from 'react-native-communications';
import {  formatMoney, formatNumber, unformat } from '../utils/format';
import logoImage from './logo';

export default Invoice = (
    customerName,
    id,
    date,
    QuocteDetail
) => {
    
    let htmlQuocteDetail = '';
    QuocteDetail.forEach((quocte) => {        
        htmlQuocteDetail += `
        <tr>
            <td>${quocte.name}</td>
            <td class = "center">${quocte.unitName}</td>
            <td class = "alignright" >${formatNumber(quocte.salePrice)}</td>
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
        <table class="quocteInfor" width="100%">
            <tr>
                <td width="50%">
                    <h5>Kính gửi Quý Khách ${customerName}</h5>
                </td>
                <td width="50%">
                    <p>Ngày Lập: ${date}</p>
                </td>
            </tr>
        </table>
    
    
        <table class="quocteDetail" width="100%">
            <thead>
                <tr>
                    <th>
                        <p><strong>Tên sản phẩm</strong></p>
                    </th>
                    <th>
                        <p><strong>Qui cách</strong></p>
                    </th>
                    <th>
                        <p><strong>Giá bán</strong></p>
                    </th>
                </tr>
            </thead>
            <tbody>
                ${htmlQuocteDetail} 
            </tbody>
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

    table.quocteDetail th,
    table.quocteDetail td {
        border-style: solid;
        border-width: 1px;
        padding: 2em;
        border-color: #7f8c8d;
    }

    table.quocteDetail th {
        text-align: center;
    }

    table.quocteDetail tr:nth-child(even) {
        background-color: #dddddd;
    }

    table.quocteDetail td:nth-child(1) {
        width: 32%;
    }

    table.quocteDetail td:nth-child(2) {
        text-align: center;
        width: 12%;
    }

    table.quocteDetail td:nth-child(3) {
        text-align: center;
        width: 15%;
    }

    table.quocteDetail td:nth-child(4) {
        text-align: right;
        width: 18%;
    }

    table.quocteDetail td:nth-child(5) {
        text-align: right;
        width: 23%;
    }
    table.quocteDetail td.alignright {
        text-align: right;
    }
    table.quocteDetail td.center {
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

    table.quocteInfor {
        text-align: center;
        font-weight: bold;
        margin-bottom: 20px;
    }
    `
}

export const sendMessage = (
    customerPhone,
    customerName,
    date,
    QuocteDetail,
) => {
    let htmlQuocteDetail = '';
    QuocteDetail.forEach((quocte) => {        
        htmlQuocteDetail += `${quocte.name}: ${quocte.unitName} : ${formatNumber(quocte.salePrice)}. `
    });
    
    Communications.text(customerPhone, `Kính gửi Quí Khách ${customerName} Báo Giá ngày: ${date}: 
    ${htmlQuocteDetail}    
    `);
}
export const sendEmail = (
    customerEmail,
    customerName,
    date,
    QuocteDetail,
) => {
    let htmlQuocteDetail = '';
    QuocteDetail.forEach((quocte) => {
        htmlQuocteDetail += `${quocte.name}: ${quocte.unitName} x ${formatNumber(quocte.salePrice)}.
        `
    });
    Communications.email([customerEmail], null, null, 'Báo Giá', `Kính gửi Quí Khách ${customerName}
    
    
        Báo Giá ngày: ${date}: 

        ${htmlQuocteDetail}
    `);
}
