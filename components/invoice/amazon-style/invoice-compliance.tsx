import React from 'react';

export function InvoiceCompliance() {
    return (
        <div className="grid grid-cols-12 gap-6 mt-8 p-6 border-2 border-border rounded-lg bg-muted/50">
            {/* Declaration */}
            <div className="col-span-8 space-y-2">
                <h4 className="text-[10px] font-bold text-muted-foreground">Declaration</h4>
                <p className="text-[10px] text-foreground leading-relaxed text-justify">
                    We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                    The goods sold are intended for end-user consumption and not for resale unless specified otherwise.
                    Tax is payable on reverse charge basis: No.
                </p>
                <p className="text-[10px] text-muted-foreground mt-2 italic">
                    This is a computer-generated invoice and does not require a physical signature.
                </p>
            </div>

            {/* Jurisdiction / Sign-off */}
            <div className="col-span-4 flex flex-col items-end justify-between text-right">
                <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-foreground">TAC Logistics Solutions</h4>
                    <p className="text-[10px] text-muted-foreground">Authorized Signatory</p>
                </div>

                {/* Digital Signature Placeholder */}
                <div className="mt-4 md:mt-0">
                    <div className="h-12 flex items-end justify-end">
                        <span className="font-handwriting text-xl text-primary rotate-[-5deg] block">
                            System Verified
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function InvoiceFooter() {
    return (
        <div className="mt-8 text-center space-y-2 border-t border-border pt-8 no-print">
            <p className="text-xs font-medium text-muted-foreground">
                Thank you for doing business with us.
            </p>
            <div className="flex justify-center gap-4 text-[10px] text-muted-foreground">
                <span>www.tac-logistics.com</span>
                <span>•</span>
                <span>support@tac-logistics.com</span>
                <span>•</span>
                <span>+91 1800-TAC-FAST</span>
            </div>
        </div>
    );
}
