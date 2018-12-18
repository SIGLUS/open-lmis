package org.openlmis.restapi.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import org.openlmis.core.serializer.DateUTCDeserializer;

import java.util.Date;

@Data
public class StockMovementsDTO {

    private String facilityCode;

    @JsonDeserialize(using = DateUTCDeserializer.class)
    private Date occurred;

    private Integer noMov = null;

    private String productCode;

    private String category;

    private Integer quantity;

    private Double price = null;

    private String lotNumber;

    @JsonDeserialize(using = DateUTCDeserializer.class)
    private Date expirationDate;

    private String referenceNumber;

    @JsonDeserialize(using = DateUTCDeserializer.class)
    private Date entiDate = null;

    private String productFullName;

    private String FacilityName;

    private String gr = null;

    @JsonDeserialize(using = DateUTCDeserializer.class)
    private Date dtemissaogr = null;

    private String productStrength;

    private String notes;
}