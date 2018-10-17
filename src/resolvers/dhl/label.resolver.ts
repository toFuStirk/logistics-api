import {Resolver, Mutation, Query } from '@nestjs/graphql';
import {Inject, UploadedFile} from '@nestjs/common';
import {LabelService} from '../../service/dhl/label.service';
import {DhlLabelReqBody} from '../../interfaces/dhl/dhl.label.req.body';
import {TrackingService} from '../../service/dhl/tracking.service';
let result;
@Resolver('label')
export class LabelResolver {
    constructor(
        @Inject(LabelService) private labelService: LabelService,
        @Inject(TrackingService) private trackingService: TrackingService
    ) {}
    @Mutation('LabelTheDelivery')
    async LabelTheDelivery(obj, body: {params: DhlLabelReqBody}) {
        result = await this.labelService.LabelTheDelivery(body.params);
        return result;
    }
    @Query('DhlTracking')
    async DhlTracking(obj, body: {params: string[] }) {
        result = await this.trackingService.tracking(body.params);
        return result;
    }
    @Mutation('DeleteOrCancelShipments')
    async DeleteOrCancelShipments(obj, body: {shipmentIDs: string[]}) {
        result = await this.trackingService.deleteOrCancelShipments(body.shipmentIDs);
        return result;
    }
    @Mutation('closeOutShipments')
    async closeOutShipments(obj, body: {shipmentItems: {shipmentID: string, bagID?: string} []}) {
        result = await this.trackingService.closeOutShipments(body.shipmentItems);
        return result;
    }
}