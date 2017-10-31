// Invoice markup
// Author: Max Kostinevich
// BETA (no styles)
// http://pdfmake.org/playground.html
// playground requires you to assign document definition to a variable called dd
import path from 'path';
import { formatMoney, formatNumber, unformat } from '../utils/format';

export default (
    id,
	customerName,
    date,
    total,
    totalIncludeVat,
    vat,
    oldDebt,
    pay,
    newDebt,
    FomulationDetail
) => {
		const htmlFomulationDetail = [];
		htmlFomulationDetail.push(
			[ 
				{
					text: 'Sản Phẩm',
					style: 'itemsHeader'
				}, 
				{
					text: 'Số lượng',
					style: ['itemsHeader', 'center']
				},
				{
					text: 'Qui cách',
					style: ['itemsHeader', 'center']
				}, 
				{
					text: 'Giá Bán',
					style: ['itemsHeader', 'right']
				}, 
				{
					text: 'Thành Tiền',
					style: ['itemsHeader', 'right']
				} 
			]
		);
		FomulationDetail.forEach((order) => {
			const totalPrice = order.salePrice * order.quantity;
			htmlFomulationDetail.push(
				[ 
					{
						text: `${order.name}`,
						style: 'itemTitle'
					},					   
					{
						text: `${formatNumber(order.quantity)}`,
						style: 'itemNumber'
					}, 
					{
						text: `${order.unitName}`,
						style: 'itemNumber'
					}, 
					{
						text: `${formatNumber(order.salePrice)}`,
						style: 'itemNumber'
					},
					{
						text: `${formatNumber(totalPrice)}`,
						style: 'itemTotal'
					} 
				]
			);
		});
		console.log('htmlFomulationDetail = ', htmlFomulationDetail);
	
	return {
		header: {
			columns: [
				{ text: 'Công ty cổ phần kim khí hóa chất Cát Tường', style: 'documentHeaderCenter' },
				{ text: '152 Giải Phóng - Cửa Bắc - Nam Định', style: 'documentHeaderCenter' },
				{ text: 'Email: sale@soncattuong.com', style: 'documentHeaderCenter' },
				{ text: 'website: www.soncattuong.com', style: 'documentHeaderCenter' },
				{ text: 'Liên hệ: 0912250315 - 0916678845 - 0916698845', style: 'documentHeaderCenter' }
			]
		},
		content: [
			{
				columns: 					
					[
						{
							text: 'Hóa Đơn', 
							style: 'invoiceTitle',
							width: '*'
						},
						{
						  stack: [
							   {
								   columns: [
										{
											text: 'Số Hóa Đơn #', 
											style: 'invoiceSubTitle',
											width: '*'
											
										}, 
										{
											text: `${id}`,
											style: 'invoiceSubValue',
											width: 100
											
										}
										]
							   },
							   {
								   columns: [
									   {
										   text: 'Ngày lập',
										   style: 'invoiceSubTitle',
										   width: '*'
									   }, 
									   {
										   text: `${date}`,
										   style: 'invoiceSubValue',
										   width: 100
									   }
									   ]
							   }
						   ]
						}
					],				
			},
			{
				columns: [
					{
						text: 'Billing From',
						style: 'invoiceBillingTitle',
						
					},
					{
						text: 'Billing To',
						style: 'invoiceBillingTitle',
						
					},
				]
			},
			{
				columns: [
					{
						text: `${customerName}`,
						style: 'invoiceBillingDetails'
					}
				]
			},
			{
				columns: [
					{
						text: 'Địa chỉ',
						style: 'invoiceBillingAddressTitle'
					}
				]
			},
			{
				columns: [
					{
						text: '..............................................................',
						style: 'invoiceBillingAddress'
					},
					
				]
			},
			'\n\n',
			{
			  table: {
				headerRows: 1,
				widths: ['*', 40, 60, 70, 100],
		
				body: htmlFomulationDetail
			  }, 
			},
			{
			  table: {
				headerRows: 0,
				widths: ['*', 80],
		
				body: [
				  [ 
					  {
						  text: 'Tổng Tiền',
						  style: 'itemsFooterSubTitle'
					  }, 
					  { 
						  text: `${total}`,
						  style: 'itemsFooterSubValue'
					  }
				  ],
				  [ 
					  {
						  text: 'Thuế',
						  style: 'itemsFooterSubTitle'
					  },
					  {
						  text: `${vat}`,
						  style: 'itemsFooterSubValue'
					  }
				  ],
				  [ 
					  {
						  text: 'Tổng tiền (gồm VAT)',
						  style: 'itemsFooterSubTitle'
					  },
					  {
						  text: `${totalIncludeVat}`,
						  style: 'itemsFooterSubValue'
					  }
				  ],
				  [ 
					  {
						  text: 'Công Nợ',
						  style: 'itemsFooterSubTitle'
					  },
					  {
						  text: `${oldDebt}`,
						  style: 'itemsFooterSubValue'
					  }
				  ],
				  [ 
					  {
						  text: 'Thanh Toán',
						  style: 'itemsFooterSubTitle'
					  },
					  {
						  text: `- ${pay}`,
						  style: 'itemsFooterSubValue'
					  }
				  ],
				  [ 
					  {
						  text: 'Còn Lại',
						  style: 'itemsFooterTotalTitle'
					  }, 
					  {
						  text: `${newDebt}`,
						  style: 'itemsFooterTotalValue'
					  }
				  ],
				]
			  }, 
			  layout: 'lightHorizontalLines'
			},
			{
				columns: [
					{
						text: '',
					},
					{
						stack: [
							{ 
								text: '_________________________________',
								style: 'signaturePlaceholder'
							},
							{ 
								text: 'Người Bán',
								style: 'signatureName'
								
							},
							{ 
								text: 'Thủ Kho',
								style: 'signatureJobTitle'
								
							}
							],
					   width: 180
					},
				]
			},
			{ 
				text: 'Ghi Chú',
				style: 'notesTitle'
			},
			{ 
				text: 'Cám ơn QUÝ KHÁCH đã tin dùng sản phẩm của chúng tôi!',
				style: 'notesText'
			}
		],
		styles: {
			documentHeaderLeft: {
				width: 50,
				alignment: 'left'
			},
			documentHeaderCenter: {
				fontSize: 10,
				margin: [5, 5, 5, 5],
				alignment: 'center'
			},
			documentHeaderRight: {
				fontSize: 10,
				margin: [5, 5, 5, 5],
				alignment: 'right'
			},
			documentFooterLeft: {
				fontSize: 10,
				margin: [5, 5, 5, 5],
				alignment: 'left'
			},
			documentFooterCenter: {
				fontSize: 10,
				margin: [5, 5, 5, 5],
				alignment: 'center'
			},
			documentFooterRight: {
				fontSize: 10,
				margin: [5, 5, 5, 5],
				alignment: 'right'
			},
			invoiceTitle: {
				fontSize: 22,
				bold: true,
				alignment: 'right',
				margin: [0, 0, 0, 15]
			},
			invoiceSubTitle: {
				fontSize: 12,
				alignment: 'right'
			},
			invoiceSubValue: {
				fontSize: 12,
				alignment: 'right'
			},
			invoiceBillingTitle: {
				fontSize: 14,
				bold: true,
				alignment: 'left',
				margin: [0, 20, 0, 5],
			},
			invoiceBillingDetails: {
				alignment: 'left'
	
			},
			invoiceBillingAddressTitle: {
				margin: [0, 7, 0, 3],
				bold: true
			},
			invoiceBillingAddress: {
				
			},
			itemsHeader: {
				margin: [0, 5, 0, 5],
				bold: true
			},
			itemTitle: {
				bold: true,
			},
			itemSubTitle: {
				italics: true,
				fontSize: 11
			},
			itemNumber: {
				margin: [0, 5, 0, 5],
				alignment: 'center',
			},
			itemTotal: {
				margin: [0, 5, 0, 5],
				bold: true,
				alignment: 'center',
			},
	
			itemsFooterSubTitle: {
				margin: [0, 5, 0, 5],
				bold: true,
				alignment: 'right',
			},
			itemsFooterSubValue: {
				margin: [0, 5, 0, 5],
				bold: true,
				alignment: 'center',
			},
			itemsFooterTotalTitle: {
				margin: [0, 5, 0, 5],
				bold: true,
				alignment: 'right',
			},
			itemsFooterTotalValue: {
				margin: [0, 5, 0, 5],
				bold: true,
				alignment: 'center',
			},
			signaturePlaceholder: {
				margin: [0, 70, 0, 0],   
			},
			signatureName: {
				bold: true,
				alignment: 'center',
			},
			signatureJobTitle: {
				italics: true,
				fontSize: 10,
				alignment: 'center',
			},
			notesTitle: {
			  fontSize: 10,
			  bold: true,  
			  margin: [0, 50, 0, 3],
			},
			notesText: {
			  fontSize: 10
			},
			center: {
				alignment: 'center',
			},
		},
		defaultStyle: {
			columnGap: 20,
		}

	};  
};
