import logo from '../images/Logo.png'
export default Invoice = (
    customerName,
    id,
    date,
    total,
    totalIncludeVat,
    vat,
    oldDebt,
    newDebt,
    OrderDetail
) => {
    let htmlOrderDetail = '';
    OrderDetail.forEach((order) => {
        const totalPrice = order.salePrice * order.quantity;
        htmlOrderDetail += `
        <tr>
            <td><span contenteditable>${order.name}</span></td>
            <td><span data-prefix></span><span contenteditable>${order.quantity}</span></td>
            <td><span contenteditable>order.unitName</span></td>
            <td><span data-prefix></span><span>${order.salePrice}</span></td>
            <td><span data-prefix></span><span>${totalPrice}</span></td>
        </tr>
        `
    });
    return `
    <!doctype html>
    <html>
    
    <head>
        <meta charset="utf-8">
        <title>Invoice</title>
        <style>
            /* reset */
    
            * {
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
            /* content editable */
    
            *[contenteditable] {
                border-radius: 0.25em;
                min-width: 1em;
                outline: 0;
            }
    
            *[contenteditable] {
                cursor: pointer;
            }
    
            *[contenteditable]:hover,
            *[contenteditable]:focus,
            td:hover *[contenteditable],
            td:focus *[contenteditable],
            img.hover {
                background: #DEF;
                box-shadow: 0 0 1em 0.5em #DEF;
            }
    
            span[contenteditable] {
                display: inline-block;
            }
            /* heading */
    
            h1 {
                font: bold 100% sans-serif;
                letter-spacing: 0.5em;
                text-align: center;
                text-transform: uppercase;
            }
            /* table */
    
            table {
                font-size: 75%;
                table-layout: fixed;
                width: 100%;
            }
    
            table {
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
                border-radius: 0.25em;
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
                font: 16px/1 'Open Sans', sans-serif;
                overflow: auto;
                padding: 0.5in;
            }
    
            html {
                background: #999;
                cursor: default;
            }
    
            body {
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
    
            header h1 {
                background: #000;
                border-radius: 0.25em;
                color: #FFF;
                margin: 0 0 1em;
                padding: 0.5em 0;
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
    
            header span,
            header img {
                display: block;
                float: right;
            }
    
            header span {
                max-height: 25%;
                max-width: 55%;
                position: relative;
            }
    
            header img {
                max-height: 30%;
                max-width: 30%;
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
                width: 36%;
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
                clear: both;
                width: 100%;
            }
    
            table.inventory th {
                font-weight: bold;
                text-align: center;
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
                text-align: right;
                width: 12%;
            }
    
            table.inventory td:nth-child(5) {
                text-align: right;
                width: 12%;
            }
            /* table balance */
    
            table.balance th,
            table.balance td {
                width: 50%;
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
            /* javascript */
    
            .add,
            .cut {
                border-width: 1px;
                display: block;
                font-size: .8rem;
                padding: 0.25em 0.5em;
                float: left;
                text-align: center;
                width: 0.6em;
            }
    
            .add,
            .cut {
                background: #9AF;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                background-image: -moz-linear-gradient(#00ADEE 5%, #0078A5 100%);
                background-image: -webkit-linear-gradient(#00ADEE 5%, #0078A5 100%);
                border-radius: 0.5em;
                border-color: #0076A3;
                color: #FFF;
                cursor: pointer;
                font-weight: bold;
                text-shadow: 0 -1px 2px rgba(0, 0, 0, 0.333);
            }
    
            .add {
                margin: -2.5em 0 0;
            }
    
            .add:hover {
                background: #00ADEE;
            }
    
            .cut {
                opacity: 0;
                position: absolute;
                top: 0;
                left: -1.5em;
            }
    
            .cut {
                -webkit-transition: opacity 100ms ease-in;
            }
    
            tr:hover .cut {
                opacity: 1;
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
                .add,
                .cut {
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
            <h1>Invoice</h1>
            <address contenteditable>
                <p>CÔNG TY CỔ PHẦN KIM KHÍ HÓA CHẤT CÁT TƯỜNG</p>
                <p>Địa chỉ: 152 Giải Phóng - Cửa Bắc - Nam Định</p>
                <p>Điệnthoại: 0912250315 - 0916698845 - 0916678845</p>
                <p>email: sale@soncattuong.com</p>
                <p>website: www.soncattuong.com</p>
            </address>
            <span><img alt="" src="${logo}"><input type="file" accept="image/*"></span>
        </header>
        <article>
            <h1>Recipient</h1>
            <address contenteditable>
                <p>${customerName}</p>
            </address>
            <table class="meta">
                <tr>
                    <th><span contenteditable>Số Hóa Đơn #</span></th>
                    <td><span contenteditable>${id}</span></td>
                </tr>
                <tr>
                    <th><span contenteditable>Ngày Lập</span></th>
                    <td><span contenteditable>${date}</span></td>
                </tr>
    
            </table>
            <table class="inventory">
                <thead>
                    <tr>
                        <th style = "width: 220px"><span contenteditable>Tên sản phẩm</span></th>
                        <th style = "width: 75px"><span contenteditable>Số lượng</span></th>
                        <th style = "width: 90px"><span contenteditable>Qui cách</span></th>
                        <th style = "width: 110px"><span contenteditable>Giá bán</span></th>
                        <th><span contenteditable>Thành Tiền</span></th>
                    </tr>
                </thead>
                <tbody>
                    ${htmlOrderDetail}
                </tbody>
            </table>
            <table class="balance">
                <tr>
                    <th><span contenteditable>Tổng Tiền</span></th>
                    <td><span data-prefix></span><span>${total}</span></td>
                </tr>
                <tr>
                    <th><span contenteditable>VAT</span></th>
                    <td><span data-prefix></span><span contenteditable>${vat}</span></td>
                </tr>
                <tr>
                    <th><span contenteditable>Tổng tiền (gồm vat)</span></th>
                    <td><span data-prefix></span><span>${totalIncludeVat}</span></td>
                </tr>
                <tr>
                    <th><span contenteditable>Nợ cũ</span></th>
                    <td><span data-prefix></span><span>${oldDebt}</span></td>
                </tr>
                <tr>
                    <th><span contenteditable>Thanh Toán</span></th>
                    <td><span data-prefix></span><span>${pay}</span></td>
                </tr>
                <tr>
                    <th><span contenteditable>Còn lại</span></th>
                    <td><span data-prefix></span><span>${newDebt}</span></td>
                </tr>
            </table>
        </article>
        <table class="inventory">
            <thead>
                <tr>
                    <th><span contenteditable>Người Nhận</span></th>
                    <th><span contenteditable>Thủ Kho</span></th>
                    <th><span contenteditable>Người Bán</span></th>
                </tr>
            </thead>
        </table>
    </body>
    
    </html>
    `
}