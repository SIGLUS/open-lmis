/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */
/**
 * Created with IntelliJ IDEA.
 * User: Messay Yohannes <deliasmes@gmail.com>
 * To change this template use File | Settings | File Templates.
 */
package org.openlmis.odkapi.domain;

import org.openlmis.core.domain.BaseModel;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.openlmis.core.domain.BaseModel;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ODKLMISSurveySubmission extends BaseModel {

    private Long ODKSubmissionId;
    private byte storeLedgerAvailable;
    private byte storeLedgersInStoreRoom;
    private byte binCardsAvailable;
    private byte binCardsKeptWithProducts;
    private byte endingBalancesEqualToStocks;
    private byte lossesAdjustmentsCorrectlyFilled;
    private byte ledgersBinCardsFilledCorrectly;
    private byte physicalStockCountsExercisesConducted;
    private byte ddrAvailable;
    private byte invoicesKeptInFile;
    private byte lastSupervisionVisitInFile;
    private double totalPercentage;
    private String comment;

}
