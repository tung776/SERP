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
            <td style = "text-align: right"><span data-prefix></span><span>${formatNumber(order.salePrice)}</span></td>
            <td style = "text-align: right"><span data-prefix></span><span>${formatNumber(totalPrice)}</span></td>
        </tr>
        `
    });
    return `
    <html>
    
    <head>
        <meta charset="utf-8"/>
        <title>Hóa Đơn</title>
        <style>
            /* reset */
           
            * {
                font-family: VU Arial;
                border: 0;
                box-sizing: content-box;
                color: inherit;
                line-height: inherit;
                list-style: none;
                margin: 0;
                padding: 0;
                text-decoration: none;
                vertical-align: top;
            }   
            
            /* heading */
    
            h1 {
                letter-spacing: 0.5em;
                text-align: center;
                text-transform: uppercase;
            }
            /* table */
    
            table {
                table-layout: fixed;
                width: 100%;
            }
    
            table {
                border-collapse: separate;
                border: none
            }
                
            
            /* page */
    
            html {
                overflow: auto;
                padding: 0.5in;
            }
    
            html {
                background: #999;
                cursor: default;
            }
    
            body {
                font-family: VU Arial;
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
            /* header */
    
            header {
                margin: 0 0 2em;
            }
    
            header:after {
                clear: both;
                content: "";
                display: table;
            }
    
            header address {
                float: left;
                font-size: 75%;
                font-style: normal;
                line-height: 1.25;
                margin: 0 1em 1em 0;
            }
    
            header address p {
                margin: 0 0 0.25em;
            }
    
            header span {
                max-height: 25%;
                max-width: 55%;
                position: relative;
            }
    
            header input {
                cursor: pointer;
                -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
                height: 100%;
                left: 0;
                opacity: 0;
                position: absolute;
                top: 0;
                width: 100%;
            }

            table.inforOrder td,
            table.companyInfor td {
                border: none
            }
            table.inforOrder,
            table.companyInfor {
                border: none;
                padding: 5px;
            }
            /* article */
    
            article,
            article address,
            table.meta,
            table.inventory {
                margin: 0 0 3em;
            }
    
            article:after {
                clear: both;
                content: "";
                display: table;
            }
    
            article h1 {
                clip: rect(0 0 0 0);
                position: absolute;
            }
    
            article address {
                float: left;
                font-size: 125%;
                font-weight: bold;
            }
            /* table meta & balance */
    
            table.meta,
            table.balance {
                float: right;
                width: 50%;
            }
    
            table.meta:after,
            table.balance:after {
                clear: both;
                content: "";
                display: table;
            }
            /* table meta */
    
            table.meta th {
                width: 40%;
            }
    
            table.meta td {
                width: 60%;
            }
            /* table items */
    
            table.inventory {
                width: 100%;
                padding: 10px;
            }
    
            table.inventory th {
                font-weight: bold;
                text-align: center;
            }
            table.inventory th,
            table.inventory td {
                border-radius: 0.25em;
                border-style: solid;
                border-width: 1px;
                padding: 0.5em;
                position: relative;
                text-align: left;
                border-color: #DDD;
            }
    
            table.inventory td:nth-child(1) {
                width: 26%;
            }
    
            table.inventory td:nth-child(2) {
                width: 38%;
            }
    
            table.inventory td:nth-child(3) {
                text-align: right;
                width: 12%;
            }
    
            table.inventory td:nth-child(4) {
                text-align: left;
                width: 12%;
            }
    
            table.inventory td:nth-child(5) {
                text-align: left;
                width: 12%;
            }
            /* table balance */
            table.balance {
                float: left;
                width: 50%;
            }
    
            table.balance th,
            table.balance td {
                width: 100%;
            }
    
            table.balance td {
                text-align: right;
            }
            /* aside */
    
            aside h1 {
                border: none;
                border-width: 0 0 1px;
                margin: 0 0 1em;
            }
    
            aside h1 {
                border-color: #999;
                border-bottom-style: solid;
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
    <header>
        <table>
            <tr >
                <td style = "width: 450px">
                    <p style = "margin: 0 0 0.25em; font-weight: bold;">CÔNG TY CỔ PHẦN KIM KHÍ HÓA CHẤT CÁT TƯỜNG</p>
                    <p style = "margin: 0 0 0.25em;">Địa chỉ: 152 Giải Phóng - Cửa Bắc - Nam Định</p>
                    <p style = "margin: 0 0 0.25em;">phone: 0912250315 - 0916698845 - 0916678845</p>
                    <p style = "margin: 0 0 0.25em;">website: www.soncattuong.com</p>

                </td>
                <td> 
                    <span>
                        <img style = "display: block;	float: right; max-height: 100%; max-width: 33%;" alt="" src="logo.png"/></span> 
                </td>
            </tr>
        
        </table>
        <h1>HÓA ĐƠN</h1>
        <table>
            <tr>
                <td><p style = "margin: 0 0 0.25em; font-weight: 700; font-size: 22px; text-align: center">${customerName}</p></td>
                <td>
                    <p style = "margin: 0 0 0.25em; text-align: right">Ngày Lập: ${date}</p>
                    <p style = "margin: 0 0 0.25em; ; text-align: right">Số Hóa Đơn: ${id}</p>
                </td>
            </tr>
        </table>
    </header>
    <article>        
        <table class="inventory">
            <thead>
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
        <table class="balance">
            <tr>
                <th style = "width: 200px"><span >Tổng Tiền</span></th>
                <td><span data-prefix></span><span>${formatNumber(total)}</span></td>
            </tr>
            <tr>
                <th style = "width: 200px"><span >VAT</span></th>
                <td><span data-prefix></span><span >${formatNumber(vat)}</span></td>
            </tr>
            <tr>
                <th style = "width: 200px"><span >Tổng tiền (gồm vat)</span></th>
                <td><span data-prefix></span><span>${formatNumber(totalIncludeVat)}</span></td>
            </tr>
            <tr>
                <th style = "width: 200px"><span >Nợ cũ</span></th>
                <td><span data-prefix></span><span>${formatNumber(oldDebt)}</span></td>
            </tr>
            <tr>
                <th style = "width: 200px"><span >Thanh Toán</span></th>
                <td><span data-prefix></span><span>${formatNumber(pay)}</span></td>
            </tr>
            <tr>
                <th style = "width: 200px"><span >Còn lại</span></th>
                <td><span data-prefix></span><span>${formatNumber(newDebt)}</span></td>
            </tr>
        </table>
    </article>
    <table class="inventory">
        <thead>
            <tr>
                <th><span >Người Nhận</span></th>
                <th><span >Thủ Kho</span></th>
                <th><span >Người Bán</span></th>
            </tr>
        </thead>
    </table>
</body>
    
    </html>
    `
}