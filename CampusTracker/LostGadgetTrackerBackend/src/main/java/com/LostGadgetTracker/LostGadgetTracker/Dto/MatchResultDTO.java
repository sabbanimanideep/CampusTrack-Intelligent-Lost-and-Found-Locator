package com.LostGadgetTracker.LostGadgetTracker.Dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MatchResultDTO {

    private Long lostId;
    private String lostItemName;

    private Long foundId;
    private String foundItemName;

    private double score;
}
